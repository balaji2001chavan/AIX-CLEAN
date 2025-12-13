import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
  res.json({ status: "AIX Backend Alive (Gemini v1beta)" });
});

function extractText(data) {
  if (!data || !data.candidates) return null;

  for (const cand of data.candidates) {
    const parts = cand?.content?.parts;
    if (!parts) continue;

    let text = "";
    for (const p of parts) {
      if (typeof p.text === "string") text += p.text;
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
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

    if (data.error) {
      return res.json({
        reply: "❌ Gemini error: " + data.error.message
      });
    }

    const reply = extractText(data);

    if (!reply) {
      return res.json({
        reply:
          "⚠️ Gemini replied but text was blocked. Try a different prompt."
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
  console.log("🚀 AIX Backend running with Gemini v1beta on port", PORT);
});
