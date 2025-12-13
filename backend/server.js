import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
  res.json({ status: "AIX Backend Alive (Gemini Stable)" });
});

function extractText(data) {
  if (!data || !data.candidates) return null;

  for (const cand of data.candidates) {
    if (!cand.content || !cand.content.parts) continue;

    let text = "";
    for (const part of cand.content.parts) {
      if (typeof part.text === "string") {
        text += part.text;
      }
    }
    if (text.trim()) return text.trim();
  }
  return null;
}

app.post("/api/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.json({ reply: "❌ Prompt missing" });
  }

  if (!GEMINI_API_KEY) {
    return res.json({
      reply: "❌ GEMINI_API_KEY missing in Render env"
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("🔍 GEMINI RAW:", JSON.stringify(data));

    const reply = extractText(data);

    if (!reply) {
      return res.json({
        reply:
          "⚠️ Gemini replied but content was blocked or empty. Try rephrasing."
      });
    }

    return res.json({ reply });

  } catch (err) {
    return res.json({
      reply: "❌ Gemini request failed: " + err.message
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 AIX Backend running with Gemini (stable) on port", PORT);
});
