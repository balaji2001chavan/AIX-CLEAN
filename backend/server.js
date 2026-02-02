import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import os from "os";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

/* ------------------ MIDDLEWARE ------------------ */
app.use(cors({ origin: "*"}));
app.use(express.json());

/* ------------------ HEALTH ------------------ */
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
      memoryGB: Math.round(os.totalmem()/1024/1024/1024)
    }
  });
});

/* ------------------ AIX CHAT API ------------------ */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message missing" });
  }

  const reply = `
Hello 👋 I am AIX – Agentic AI

You said:
"${message}"

🧠 Current Status:
• Server: ONLINE
• Mode: AGENTIC
• Host: ${os.hostname()}
• Platform: ${os.platform()}
• Free RAM: ${Math.round(os.freemem()/1024/1024)} MB

⚡ I can:
✔ Build apps / websites
✔ Debug AWS / NGINX / PM2
✔ Generate marketing, reels, leads
✔ Create business systems
✔ Act like ChatGPT + EXECUTE real tasks

Tell me what to BUILD, FIX, or SCALE.
`;

  res.json({
    success: true,
    reply: reply.trim(),
    agent: "AIX"
  });
});

/* ------------------ START ------------------ */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AIX backend running on ${PORT}`);
});
