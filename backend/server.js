import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- ROOT (HTML problem FIX) ---------- */
app.get("/", (req, res) => {
  res.send(`
    <h1>AIX Agentic AI Backend is LIVE 🚀</h1>
    <p>Status: RUNNING</p>
    <p>Use <code>/api/health</code> or <code>/api/aix/chat</code></p>
  `);
});

/* ---------- HEALTH CHECK ---------- */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    mode: "AGENTIC",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* ---------- AIX CHAT (CORE) ---------- */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // 🔥 Agentic placeholder (future: OpenAI, tools, actions)
  const reply = `🤖 AIX says: "${message}"\n\n✅ I understood you.\n🧠 I am ready to act next.`;

  res.json({
    reply,
    agent: "AIX",
    actionMode: "READY",
    next: "REAL ACTIONS (files, APIs, automation)"
  });
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`🚀 AIX server running on port ${PORT}`);
});
