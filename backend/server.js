import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- HEALTH CHECK ---------- */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* ---------- AIX CHAT CORE ---------- */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // 🔥 For now: echo brain (later OpenAI/Gemini plug-in)
  const reply = `AIX says: I received → "${message}". I am alive, learning, and ready to execute.`;

  res.json({
    reply,
    mode: "AGENTIC",
    executed: false
  });
});

/* ---------- SERVER START ---------- */
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AIX server running on port ${PORT}`);
});
