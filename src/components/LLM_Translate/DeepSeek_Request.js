import OpenAI from "openai";
export default function DeepSeek_Request(){
  const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: "sk-b0bc757588694931a98b20cf8357ee29",
      dangerouslyAllowBrowser: true
  })
  async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant" }, 
          {role:"user", content:"This is a test, hello world"}
      ],
      model: "deepseek-chat",
    });

    console.log(completion.choices[0].message.content);
  }

  main();
}