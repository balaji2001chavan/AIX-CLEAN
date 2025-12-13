import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({ reply: "❌ Prompt missing" });
    }

    if (!GROQ_API_KEY) {
      return res.json({ reply: "❌ GROQ_API_KEY missing" });
    }

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
                "You are AIX. Reply clearly in Marathi or English."
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
      data.choices?.[0]?.message?.content || "No AI reply";

    res.json({ reply });
  } catch (err) {
    res.json({ reply: "❌ Backend error: " + err.message });
  }
});

export default router;
