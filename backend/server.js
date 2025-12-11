import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    ok: true,
    msg: "Boss AIX Backend LIVE",
    time: new Date().toISOString(),
  });
});

// COMMAND API
app.post("/api/boss/command", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ error: "NO MESSAGE RECEIVED" });
    }

    // LOCAL OLLAMA CONNECT
    const ai = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: message,
        stream: false,
      }),
    });

    const data = await ai.json();

    return res.json({
      boss: true,
      heard: message,
      reply: data.response || "AI ERROR",
    });
  } catch (e) {
    return res.json({
      boss: true,
      heard: req.body.message,
      reply: "Backend AI error",
      error: e.toString(),
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Boss AIX Backend running"));
