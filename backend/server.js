import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import detectIntent from "./agents/intentAgent.js";
import planner from "./agents/plannerAgent.js";
import executor from "./agents/executorAgent.js";

dotenv.config();

const app = express();

/* ====== MIDDLEWARE ====== */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

/* ====== HEALTH CHECK ====== */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* ====== MAIN AIX API ====== */
app.post("/api/aix/chat", async (req, res) => {
  try {
    const message = req.body.message || "";

    const intent = detectIntent(message);
    const plan = planner(intent, message);
    const output = await executor(intent, message);

    res.json({
      aix: true,
      intent,
      plan,
      result: output
    });
  } catch (err) {
    res.status(500).json({
      error: "AIX execution failed",
      details: err.message
    });
  }
});

/* ====== START SERVER ====== */
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 AIX Server running on port ${PORT}`);
});
