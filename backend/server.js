import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { runAIX } from "./aix-agent.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

/* HEALTH */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* CHAT */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    const reply = await runAIX(message);
    res.json({ reply, mode: "AGENTIC" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AIX backend running on port ${PORT}`);
});
