import express from "express";
import cors from "cors";
import os from "os";

const app = express();

/* ===== BASIC CONFIG ===== */
app.use(express.json());
app.use(cors({
  origin: "*",   // frontend anywhere (vercel/domain)
}));

/* ===== HEALTH CHECK ===== */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    serverTime: new Date().toISOString(),
    system: {
      hostname: os.hostname(),
      platform: os.platform(),
      cpu: os.cpus().length,
      memoryGB: Math.round(os.totalmem() / 1024 / 1024 / 1024),
    }
  });
});

/* ===== CHAT ENDPOINT ===== */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "No message provided"
    });
  }

  // 🔮 Future AI brain goes here (OpenAI / Gemini / HF)
  const reply = `AIX received your message: "${message}". 
System is online. Tell me what to build, fix, or analyze.`;

  res.json({
    success: true,
    reply,
    mode: "AGENTIC"
  });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AIX backend running on port ${PORT}`);
});
