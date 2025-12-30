import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- HEALTH CHECK ---------- */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    ai: "AIX",
    mode: "online",
    time: new Date().toISOString()
  });
});

/* ---------- AIX CHAT (basic) ---------- */
app.post("/api/aix", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message required" });
  }

  // Temporary smart fallback (ChatGPT-style tone)
  res.json({
    reply: `नमस्कार Boss 👑  
मी AIX आहे.  
तू म्हणालास: "${message}"  

आत्ता मी LIVE आहे, server stable आहे,  
आणि पुढे मी OpenAI / Gemini / tools जोडायला तयार आहे.  
पुढचा आदेश दे 🔥`
  });
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`✅ AIX server running on port ${PORT}`);
});
