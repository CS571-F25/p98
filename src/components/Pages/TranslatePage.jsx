import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Languages, Key, ArrowRight, X, Loader2 } from "lucide-react";
import "./translatePage.css";

const TranslationPage = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // 表单状态
  const [formData, setFormData] = useState({
    apiKey: "",
    fileType: "epub",
    sourceLang: "auto",
    targetLang: "zh",
    model: "gpt-4o"
  });

  // --- 交互逻辑 ---
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleTranslate = () => {
    if (!file || !formData.apiKey) return;
    setIsProcessing(true);
    // 模拟处理过程
    setTimeout(() => {
      setIsProcessing(false);
      alert("Translation simulation complete!");
    }, 3000);
  };

  return (
    <div className="translate-root">
      <div className="translate-shell">
        <header className="translate-header">
          <h1 className="translate-title font-cinzel">THE INTERPRETER</h1>
          <p className="translate-subtitle">
            "Bridging worlds, one document at a time."
          </p>
        </header>

        <div className="translate-grid">
          <div className="translate-panel-stack">
            <div className="translate-panel">
              <div className="translate-panel-heading">
                <Key size={18} />
                <span className="font-cinzel">ACCESS CREDENTIALS</span>
              </div>
              <div className="translate-field">
                <label className="translate-label">OpenAI API Key</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  className="translate-input"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                />
              </div>
              <div className="translate-field">
                <label className="translate-label">Model Selection</label>
                <select
                  className="translate-input"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                >
                  <option value="gpt-4o">GPT-4o (Recommended)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
            </div>

            <div className="translate-panel">
              <div className="translate-panel-heading">
                <Languages size={18} />
                <span className="font-cinzel">LINGUISTIC PARAMETERS</span>
              </div>
              <div className="translate-field">
                <label className="translate-label">Source Language</label>
                <select
                  className="translate-input"
                  value={formData.sourceLang}
                  onChange={(e) => setFormData({ ...formData, sourceLang: e.target.value })}
                >
                  <option value="auto">Auto Detect</option>
                  <option value="en">English</option>
                  <option value="zh">Chinese</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="jp">Japanese</option>
                </select>
              </div>
              <div className="translate-field">
                <label className="translate-label">Target Language</label>
                <select
                  className="translate-input"
                  value={formData.targetLang}
                  onChange={(e) => setFormData({ ...formData, targetLang: e.target.value })}
                >
                  <option value="zh">Simplified Chinese</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="jp">Japanese</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          <div className="translate-actions">
            <div
              className={`translate-dropzone ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="translate-file-input"
                accept=".epub,.pdf,.docx,.txt"
              />

              {file ? (
                <div className="translate-upload-info">
                  <div className="translate-upload-icon translate-upload-icon--file">
                    <FileText size={30} color="#cba164" />
                  </div>
                  <h3 className="font-cinzel translate-dropzone-title">{file.name}</h3>
                  <p className="translate-upload-meta">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    className="translate-remove-button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    <X size={14} /> Remove File
                  </button>
                </div>
              ) : (
                <>
                  <div className="translate-upload-icon">
                    <UploadCloud size={40} color="#9d8f73" />
                  </div>
                  <h3 className="font-cinzel translate-dropzone-title">Upload Artifact</h3>
                  <p className="translate-dropzone-text">
                    Drag and drop your manuscript here, or click to browse.
                    <span className="translate-dropzone-note">Supported formats: EPUB, PDF, DOCX</span>
                  </p>
                </>
              )}
            </div>

            <div className="translate-format-controls">
              <span className="translate-format-label">Document Format:</span>
              {["epub", "pdf", "docx"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, fileType: type })}
                  className={`translate-format-button ${formData.fileType === type ? "active" : ""}`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={handleTranslate}
              disabled={!file || !formData.apiKey || isProcessing}
              className={`translate-submit ${file && formData.apiKey && !isProcessing ? "animate-pulse-gold" : ""}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="translate-spinner" /> TRANSLATING...
                </>
              ) : (
                <>
                  BEGIN TRANSMUTATION <ArrowRight size={20} />
                </>
              )}
            </button>

            {!formData.apiKey && (
              <p className="translate-warning">* API Key is required to proceed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationPage;
