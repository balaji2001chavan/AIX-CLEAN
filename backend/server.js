import express from "express";
import cors from "cors";
import OpenAI from "openai";

/* ================= APP ================= */
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 10000;

/* ================= DEBUG ================= */
console.log("🔥 AIX SERVER FILE LOADED");

/* ================= OPENAI ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY NOT FOUND");
}

/* ================= MEMORY ================= */
let conversation = [];

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.send("AIX AI BRAIN SERVER LIVE");
});

/* ================= MAIN AI ENDPOINT ================= */
app.post("/api/aix", async (req, res) => {
  try {
    console.log("👉 /api/aix HIT:", req.body);

    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({
        reply: "काय सांगायचं आहे बॉस?"
      });
    }

    // Store user message
    conversation.push({
      role: "user",
      content: userMessage
    });

    // Limit memory
    if (conversation.length > 10) {
      conversation = conversation.slice(-10);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are AIX (Action Intelligence X).

You speak like ChatGPT.
You are human-like, intelligent, practical.
You understand intent, emotions, and context.
You reply in Marathi, Hindi, or English as needed.

You suggest real actions and explain before acting.
You never repeat the same reply.
You sound like a trusted advisor, not a bot.
`
        },
        ...conversation
      ]
    });

    const aiReply = completion.choices[0].message.content;

    console.log("🤖 AIX REPLY:", aiReply);

    // Store assistant reply
    conversation.push({
      role: "assistant",
      content: aiReply
    });

    return res.json({
      reply: aiReply
    });

  } catch (err) {
    console.error("❌ AIX ERROR:", err);
    return res.status(500).json({
      reply: "AIX मध्ये तांत्रिक अडचण आली आहे.",
      error: err.message
    });
  }
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("🚀 AIX AI BRAIN running on port", PORT);
});
