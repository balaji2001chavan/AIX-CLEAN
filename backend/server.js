import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ----------------- DATABASE ----------------- */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("🟢 MongoDB connected"))
  .catch(err => console.error("🔴 MongoDB error", err));

const MemorySchema = new mongoose.Schema({
  role: String,
  message: String,
  time: { type: Date, default: Date.now }
});

const Memory = mongoose.model("Memory", MemorySchema);

/* ----------------- OPENAI ----------------- */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ----------------- HEALTH ----------------- */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* ----------------- AIX CHAT ----------------- */
app.post("/api/aix/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // save user message
    await Memory.create({ role: "user", message });

    // load last memory
    const history = await Memory.find().sort({ time: -1 }).limit(10);

    const systemPrompt = `
You are AIX.
You are not a chatbot.
You are an autonomous advisor, engineer, and executor.

Rules:
- Speak like a calm human advisor
- Explain what you understand
- Propose a plan
- Ask before executing real actions
- Remember past conversations
- Help build apps, businesses, systems, AI tools
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.reverse().map(h => ({
          role: h.role,
          content: h.message
        })),
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    // save AIX reply
    await Memory.create({ role: "assistant", message: reply });

    res.json({
      reply,
      mode: "AGENTIC",
      memory_used: history.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AIX brain failure" });
  }
});

/* ----------------- SERVER ----------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AIX brain running on port ${PORT}`);
});
