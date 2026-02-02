// backend/server.js
import express from "express";
import cors from "cors";
import os from "os";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* ---------- CORS (VERY IMPORTANT) ---------- */
app.use(
  cors({
    origin: [
      "https://boss-aix-frontend.vercel.app",
      "https://allinonestopdeals.com",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

/* ---------- HEALTH ---------- */
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
      memoryGB: Math.round(os.totalmem() / 1024 / 1024 / 1024)
    }
  });
});

/* ---------- CHAT (BASIC SMART CORE) ---------- */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message missing" });
  }

  // Placeholder brain (Phase-3 मध्ये OpenAI / Gemini येईल)
  const reply = `AIX understood: "${message}".  
System is running fine. Backend + Domain + AWS OK.  
Tell me what to build, fix, or grow.`;

  res.json({
    success: true,
    reply,
    meta: {
      handledBy: "AIX-Core",
      time: new Date().toISOString()
    }
  });
});

/* ---------- START ---------- */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AIX backend running on port ${PORT}`);
});
