/**
 * AIX – Agentic AI Backend (FINAL MASTER)
 * Works with:
 * - AWS EC2
 * - NGINX reverse proxy
 * - Vercel frontend
 * - Custom Domain (HTTPS)
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const os = require("os");

const app = express();

/* ---------------- BASIC MIDDLEWARE ---------------- */

app.use(express.json({ limit: "2mb" }));

// CORS – Vercel + Domain safe
app.use(
  cors({
    origin: "*", // production मध्ये specific domain देऊ शकतो
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------------- HEALTH CHECK ---------------- */

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
    },
  });
});

/* ---------------- AIX CHAT API ---------------- */

app.post("/api/aix/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    /**
     * 🔮 FUTURE:
     * Here we will plug:
     * - OpenAI
     * - Gemini
     * - HuggingFace
     * - MongoDB memory
     * - Tool execution
     */

    // TEMP intelligent response (system alive proof)
    const reply = `🧠 AIX heard you: "${message}"
I am alive, connected, and ready to evolve.`;

    res.json({
      success: true,
      mode: "AGENTIC",
      reply,
    });
  } catch (err) {
    console.error("AIX ERROR:", err);
    res.status(500).json({
      success: false,
      error: "AIX internal error",
    });
  }
});

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AIX backend running on port ${PORT}`);
});
