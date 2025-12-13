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

  if (!GROQ_API_KEY) {
    return res.json({
      reply: "❌ GROQ_API_KEY missing in Render env"
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
          model: "llama3-8b-8192",   // ✅ FIXED MODEL
          messages: [
            {
              role: "system",
              content:
                "You are BOSS AIX. Reply clearly in Marathi or English."
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

    if (data.error) {
      return res.json({
        reply: "❌ Groq error: " + data.error.message
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "⚠️ AI responded but no text";

    return res.json({ reply });

  } catch (err) {
    return res.json({
      reply: "❌ AI request failed: " + err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 AIX Backend running with Groq on port", PORT);
});
