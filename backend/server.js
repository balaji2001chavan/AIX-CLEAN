import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json({ limit: "2mb" }));

/* ---------------- HEALTH CHECK ---------------- */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    mode: "AGENTIC",
    time: new Date().toISOString()
  });
});

/* ---------------- AIX CHAT CORE ---------------- */
/*
  हे बेस AIX ब्रेन आहे
  पुढे:
  - tools
  - file ops
  - automation
  - agents
  हे सगळं इथे जोडणार
*/
app.post("/api/aix/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 🔮 AIX system personality (base)
    const aixReply = `
AIX ACTIVE 🧠

You said: "${userMessage}"

I am AIX – an agentic intelligence.
I can:
• plan
• explain
• improve systems
• automate work
• grow myself step-by-step

Next step?
Tell me WHAT you want to build, fix, or automate.
`;

    res.json({
      success: true,
      reply: aixReply.trim(),
      agent: "AIX",
      next: "READY_FOR_REAL_ACTIONS"
    });

  } catch (err) {
    console.error("AIX ERROR:", err);
    res.status(500).json({
      success: false,
      error: "AIX core failure"
    });
  }
});

/* ---------------- ROOT (NO HTML) ---------------- */
app.get("/", (req, res) => {
  res.json({
    app: "AIX",
    message: "AIX backend is alive. Use /api/aix/chat",
  });
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AIX SERVER RUNNING ON PORT ${PORT}`);
});
