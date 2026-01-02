import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "AIX",
    time: new Date().toISOString()
  });
});

/* =========================
   CHAT API (AIX CORE)
========================= */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    // TEMP intelligent reply (later OpenAI / Gemini जोडू)
    const reply = `🤖 AIX ऐकत आहे.\nतुम्ही म्हणालात: "${message}"\n\nपुढील आदेश द्या बॉस.`;

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* =========================
   SERVER START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 AIX server running on port ${PORT}`);
});
