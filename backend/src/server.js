import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { runAIX } from "./aix-agent.js";

const app = express();

app.use(cors());
app.use(express.json());

/* HEALTH CHECK */
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
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const reply = await runAIX(message);
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AIX backend running on port ${PORT}`);
});
