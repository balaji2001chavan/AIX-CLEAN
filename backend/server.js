// ==============================
// BOSS AIX – FINAL BACKEND CORE
// ==============================

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE", time: new Date() });
});

// 🔥 MAIN AIX REPLY ENGINE
app.post("/api/aix", async (req, res) => {
  try {
    const msg = req.body.message;
    if (!msg) return res.status(400).json({ error: "MESSAGE_REQUIRED" });

    // MODEL → llama3.2 or phi3
    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        model: "llama3.2",
        prompt: `तू Boss AIX आहेस. तू माणसासारखे बोलशील, भावना ठेवशील, 
समोरचा काय म्हणतो ते समजशील.
उत्तर नैसर्गिक, स्पष्ट, conversational दे.
User म्हणाला: "${msg}"`,
        stream: false,
      }),
    });

    const data = await ollamaRes.json();

    return res.json({
      boss: true,
      reply: data.response || "मी तयार आहे.",
      model: "llama3.2",
    });

  } catch (err) {
    return res.status(500).json({ error: "AIX_INTERNAL_ERROR", details: err.message });
  }
});

app.listen(5000, () => console.log("🔥 Boss AIX Backend running on 5000"));
