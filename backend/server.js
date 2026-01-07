// server.js  (AIX FINAL BACKEND)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));
app.use(express.json());

/* ---------------- OPENAI ---------------- */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ---------------- HEALTH CHECK ---------------- */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* ---------------- AIX CHAT ---------------- */
app.post("/api/aix/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are AIX – an Agentic AI. You explain, plan, ask before acting, and guide the user step-by-step."
        },
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content,
      agent: "AIX",
      next: "ready_for_actions"
    });

  } catch (err) {
    console.error("AIX ERROR:", err.message);
    res.status(500).json({
      error: "AIX backend error",
      details: err.message
    });
  }
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`✅ AIX backend running on port ${PORT}`);
});
