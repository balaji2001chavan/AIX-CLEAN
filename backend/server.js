import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🔥 CORS FIX (Render + Frontend)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// 🔥 Health check
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// 🔥 MAIN AIX ROUTE (IMPORTANT)
app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body.message || "";

    // 🧠 If no message
    if (!message.trim()) {
      return res.json({ reply: "काय मदत करू, बॉस?" });
    }

    // 🔥 Call Ollama (local) OR main cloud AI…
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: message,
        stream: false,
      }),
    });

    const data = await response.json();
    return res.json({
      reply: data.response || "मी समजू शकलेलो नाही बॉस… पुन्हा सांगा.",
    });

  } catch (error) {
    console.log("AIX ERROR:", error);
    return res.json({
      reply: "AIX ERROR: Ollama चालू नाही.",
      error: error.message,
    });
  }
});

// 🔥 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Boss AIX Backend running on port", PORT);
});
