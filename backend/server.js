import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString(),
  });
});

/* =========================
   AIX BRAIN (LLM CALL)
========================= */
async function callLLM(userMessage) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are AIX – an Agentic AI.
You do not just talk.
You analyze, plan, and explain actions step by step.
When useful, suggest real-world execution steps.
`,
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

/* =========================
   AIX CHAT API
========================= */
app.post("/api/aix/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const reply = await callLLM(message);

    res.json({
      reply,
      agent: "AIX",
      mode: "AGENTIC",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AIX brain error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AIX Backend running on port ${PORT}`);
});
