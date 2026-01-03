// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK (IMPORTANT)
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "AIX",
    role: "Friend + Advisor + Engineer",
    languageMode: "AUTO",
    time: new Date().toISOString()
  });
});

/* =========================
   AIX CHAT CORE
========================= */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message missing" });
  }

  // 🔥 AUTO LANGUAGE (simple & effective)
  const isMarathi = /[अ-ह]/.test(message);
  const isHindi = /[क-ह]/.test(message);

  let reply;

  if (isMarathi) {
    reply = `मी तुझा मित्र, सल्लागार आणि इंजिनिअर आहे.  
तू म्हणालास: "${message}"

आता सांग:
• हे फक्त समजावू का?
• की रियल काम करून दाखवू?`;
  } else if (isHindi) {
    reply = `मैं तुम्हारा दोस्त, सलाहकार और इंजीनियर हूँ।  
आपने कहा: "${message}"

बताइए:
• सिर्फ समझाऊँ?
• या रियल काम करके दिखाऊँ?`;
  } else {
    reply = `I am your friend, advisor, and engineer.  
You said: "${message}"

Tell me:
• Explain only?
• Or do real work and show on screen?`;
  }

  res.json({
    success: true,
    reply,
    nextStep: "WAITING_FOR_PERMISSION"
  });
});

/* =========================
   SERVER START
========================= */
app.listen(PORT, () => {
  console.log(`✅ AIX server running on port ${PORT}`);
});
