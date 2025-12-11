import express from "express";
import cors from "cors";
import fetch from "node-fetch";        // FIX 1
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

// ====== MIDDLEWARE ======
app.use(cors({
    origin: "*",                      // FIX 2 - Frontend connected
    methods: "GET,POST"
}));
app.use(bodyParser.json());

// ====== ROOT CHECK ======
app.get("/", (req, res) => {
    res.json({
        ok: true,
        msg: "Boss AIX Backend LIVE",
        time: new Date().toISOString(),
    });
});

// ====== AI ENGINE CALL ======
async function askAI(prompt) {
    try {
        const r = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.2",
                prompt: prompt,
                stream: false,
            })
        });

        const data = await r.json();
        return data.response || "AIX: मी समजू शकलो नाही.";
    } catch (err) {
        return "AIX ERROR: Ollama चालू नाही.";
    }
}

// ====== MAIN COMMAND ROUTE ======
app.post("/api/boss/command", async (req, res) => {
    const msg = req.body.message || "";

    if (!msg.trim()) {
        return res.json({ reply: "AIX: रिकामा संदेश मिळाला." });
    }

    const aiResponse = await askAI(msg);

    res.json({
        heard: msg,
        reply: aiResponse,
        boss: true
    });
});

// ====== START SERVER ======
app.listen(PORT, () => {
    console.log(`Boss AIX Backend running on port ${PORT}`);
});
