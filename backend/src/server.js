import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "AIX Backend",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* =========================
   CHAT API (SMART BASE)
========================= */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({
        reply: "😅 अरे, काही तरी बोल ना… मी ऐकतोय!"
      });
    }

    // 🔮 future: OpenAI / Gemini / HF इथे जोडणार
    const reply = `🤖 AIX: तू म्हणालास → "${message}".  
मी सध्या शिकतोय, पण लवकरच स्वतः निर्णय घेईन 😄`;

    res.json({
      success: true,
      reply
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
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 AIX Backend running on http://127.0.0.1:${PORT}`);
});
