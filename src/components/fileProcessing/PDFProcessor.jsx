import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url"
import { PDFDocument, StandardFonts } from "pdf-lib"
import { encode } from "gpt-tokenizer"
import { generateTermTable } from "./termTable"
import translateGlossary from "./GlossaryTranslator"
import LLM_Request from "../LLM/LLM_Request"

const MAX_TOKENS = 2000

// 配置 pdf.js worker（使用 Vite 资源 URL）
GlobalWorkerOptions.workerSrc = workerSrc

export default async function PDFProcessor(file, options = {}) {
  const { sourceLang = "en", targetLang = "zh", apiKey = "", bookTitle = "", author = "", domain = "", model = "deepseek-chat", glossaryOnly = false, overrideGlossary = null, useGlossary = true, onProgress = undefined } = options

  const arrayBuffer = await file.arrayBuffer()
  // 为 pdf.js 和 pdf-lib 分别准备独立的副本，防止其中一个传输后导致另一份被 detach
  const pdfJsBytes = arrayBuffer.slice(0)
  const pdfLibBytes = arrayBuffer.slice(0)

  // 1) 提取纯文本（按页）
  const pdf = await getDocument({ data: pdfJsBytes }).promise
  const pages = pdf.numPages
  const pageTexts = []
  for (let i = 1; i <= pages; i += 1) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item) => item.str).join(" ").trim()
    if (pageText.length > 0) {
      pageTexts.push({ index: i, text: pageText })
    } else {
      pageTexts.push({ index: i, text: "" })
    }
  }

  // 2) 生成术语表
  let termTable = []
  if (useGlossary) {
    const fullPlainText = pageTexts.map(p => p.text).join("\n")
    let rawTable = await generateTermTable(fullPlainText, { topN: 150, minFreq: 3, language: sourceLang })
    const glossary = await translateGlossary(rawTable, { sourceLang, targetLang, apiKey, bookTitle, author, domain, model })
    let translationGlossary = glossary.simpleGlossary
    if (overrideGlossary && Array.isArray(overrideGlossary) && overrideGlossary.length > 0) {
      translationGlossary = overrideGlossary.map(item => ({ term: item.term, translation: item.translation || "" }))
      console.log("using user-edited glossary for PDF:", translationGlossary)
    }
    termTable = translationGlossary
    if (glossaryOnly) {
      return { detailedGlossary: glossary.detailedGlossary }
    }
  } else {
    console.log("Skipping glossary generation for PDF as requested")
  }

  // 3) 计算总 chunk 数量
  let totalChunks = 0
  pageTexts.forEach(({ text }) => {
    const tokens = encode(text).length
    if (tokens <= MAX_TOKENS) {
      totalChunks += 1
    } else {
      const chunks = Math.ceil(tokens / MAX_TOKENS)
      totalChunks += chunks
    }
  })
  let completedChunks = 0

  // 4) 翻译（按页切分成小块）
  const translatedPages = []
  for (const page of pageTexts) {
    const segments = []
    let buffer = []
    let tokenCount = 0
    const sentences = page.text.split(/\n+/).filter(Boolean)
    sentences.forEach((s) => {
      const tks = encode(s).length
      if (tokenCount + tks > MAX_TOKENS && buffer.length > 0) {
        segments.push(buffer.join("\n"))
        buffer = []
        tokenCount = 0
      }
      buffer.push(s)
      tokenCount += tks
    })
    if (buffer.length > 0) segments.push(buffer.join("\n"))

    const translatedSegments = []
    for (const segment of segments) {
      const translated = await LLM_Request([segment], termTable, "text", "", { sourceLang, targetLang, apiKey, bookTitle, author, domain, model }).catch((err) => {
        console.warn("PDF translation failed, fallback to source", err)
        return [segment]
      })
      translatedSegments.push(Array.isArray(translated) ? translated.join("\n") : translated)
      completedChunks += 1
      if (onProgress && totalChunks > 0) {
        onProgress(completedChunks, totalChunks)
      }
    }

    translatedPages.push({
      index: page.index,
      original: page.text,
      translated: translatedSegments.join("\n\n")
    })
  }

  // 5) 生成新 PDF：保留原页面，附加译文页，图片等元素保持原样
  const pdfDoc = await PDFDocument.load(new Uint8Array(pdfLibBytes))
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  translatedPages.forEach(({ index, translated }) => {
    const basePage = pdfDoc.getPage(index - 1) || pdfDoc.getPage(0)
    const { width, height } = basePage.getSize()
    const page = pdfDoc.addPage([width, height])
    const margin = 40
    const textWidth = width - margin * 2
    const wrapped = wrapText(translated, 14, font, textWidth)
    let cursorY = height - margin
    page.setFont(font)
    page.setFontSize(14)
    wrapped.forEach(line => {
      if (cursorY < margin) {
        cursorY = height - margin
      }
      page.drawText(line, { x: margin, y: cursorY })
      cursorY -= 18
    })
    page.drawText(`Page ${index} Translation`, { x: margin, y: height - margin + 10, size: 10, font })
  })

  const pdfBytes = await pdfDoc.save()
  triggerDownload(pdfBytes, file.name.replace(/\.[^.]+$/, "") + "_translated.pdf")
}

function sanitizeForFont(font, text) {
  const chars = Array.from(text)
  const safe = []
  for (const ch of chars) {
    try {
      font.encodeText(ch)
      safe.push(ch)
    } catch (e) {
      safe.push("?")
    }
  }
  return safe.join("")
}

function wrapText(text, fontSize, font, maxWidth) {
  const lines = []
  const paragraphs = text.split(/\n+/)
  paragraphs.forEach(p => {
    const words = p.split(/\s+/)
    let current = ""
    words.forEach(word => {
      const testLine = current ? `${current} ${word}` : word
      const safeLine = sanitizeForFont(font, testLine)
      const width = font.widthOfTextAtSize(safeLine, fontSize)
      if (width > maxWidth && current) {
        lines.push(sanitizeForFont(font, current))
        current = word
      } else {
        current = testLine
      }
    })
    if (current) lines.push(sanitizeForFont(font, current))
    lines.push("")
  })
  return lines
}

function triggerDownload(bytes, filename){
  const blob = new Blob([bytes], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
