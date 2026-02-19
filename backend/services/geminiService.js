require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function askGemini(question, contextList) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })
    const history = contextList.map(item => `${item.content} (${item.timestamp})`).join("\n")
    const prompt = `
    You are a helpful business assistant.

    Question: ${question}

    History:
    ${history}

    Reply only in JSON:
    {
      "decision": "...",
      "reason": "..."
    }
    `

    // Generate response
    const result = await model.generateContent(prompt)

    // Convert text into JSON
    const text = result.response.text().replace(/```json|```/g, "").trim()

    return JSON.parse(text)

  } catch (err) {
    console.log("Gemini Error:", err)
    return { decision: "Error", reason: "AI not responding" }
  }
}

module.exports = { askGemini }