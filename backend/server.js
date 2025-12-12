import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const PORT = process.env.PORT || 5000;

// --- SIMPLE SMART AIX BRAIN (fallback when Ollama not available) ---
function smartBrain(msg) {
  if (!msg) return "मी ऐकू शकलो नाही, पुन्हा बोला.";

  msg = msg.toLowerCase();

  if (msg.includes("hi") || msg.includes("hello")) {
    return "नमस्कार! मी Boss AIX आहे, कशी मदत करू?";
  }

  if (msg.includes("तू काय करू शकतोस") || msg.includes("मदत")) {
    return "मी माहिती, shopping, ideas, planning, property data — सर्व गोष्टी मिळवून देऊ शकतो.";
  }

  if (msg.includes("व्हिडिओ") || msg.includes("video")) {
    return "मी व्हिडिओ generate करू शकतो — पण त्यासाठी मला तुमच्या सिस्टमवर video AI plugin जोडावे लागतील.";
  }

  return `मी समजलो: "${msg}" — आणखी स्पष्ट सांगा, मी लगेच मदत करतो.`;
}

// --- AIX MAIN API ---
app.post("/api/aix", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "MESSAGE_REQUIRED" });

    // Fallback Smart Reply
    const reply = smartBrain(message);

    return res.json({
      boss: true,
      heard: message,
      reply,
      model: "AIX-FALLBACK-SMART",
    });
  } catch (err) {
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

app.listen(PORT, () => console.log(`🔥 Boss AIX Backend running on ${PORT}`));
