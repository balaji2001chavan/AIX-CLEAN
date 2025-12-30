import OpenAI from "openai";
import fetch from "node-fetch";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function routeAI(messages) {
  /* ====== PRIORITY ORDER ======
     1. OpenAI (best reasoning)
     2. Gemini
     3. HuggingFace
  */

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    return {
      text: completion.choices[0].message.content,
      provider: "OpenAI"
    };

  } catch (openaiError) {
    console.warn("⚠️ OpenAI failed, trying Gemini");

    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: messages.at(-1).content }] }]
          })
        }
      );

      const geminiData = await geminiRes.json();
      return {
        text: geminiData.candidates[0].content.parts[0].text,
        provider: "Gemini"
      };

    } catch (geminiError) {
      console.warn("⚠️ Gemini failed, trying HuggingFace");

      const hfRes = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: messages.at(-1).content })
        }
      );

      const hfData = await hfRes.json();
      return {
        text: hfData[0]?.generated_text || "No response",
        provider: "HuggingFace"
      };
    }
  }
}
