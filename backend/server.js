import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.get("/", (req, res) => {
  res.json({ status: "AIX Backend Alive" });
});

app.post("/api/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.json({ reply: "❌ Prompt missing" });
  }

  // 🟡 If API key missing
  if (!GROQ_API_KEY) {
    return res.json({
      reply:
        "⚠️ GROQ_API_KEY missing. Backend is OK, AI not enabled yet."
    });
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are AIX, a smart assistant. Reply clearly in Marathi or English."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "⚠️ AI responded but no text found";

    return res.json({ reply });

  } catch (err) {
    return res.json({
      reply: "❌ AI request failed: " + err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 AIX Backend with AI running on port", PORT);
});
