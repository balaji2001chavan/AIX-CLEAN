// FINAL BOSS AIX BACKEND (Render + Local + CORS FIXED)

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ CORS — FRONTEND URL ALLOWED
app.use(cors({
    origin: [
        "https://boss-aix-frontend.onrender.com",
        "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

// 🟢 HEALTH CHECK
app.get("/", (req, res) => {
    res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// 🟡 MAIN AIX ROUTE
app.post("/api/aix", async (req, res) => {
    try {
        const user = req.body.message || "";

        if (!user.trim()) {
            return res.json({ text: "रिकामा संदेश मिळाला." });
        }

        // --- Replace YOUR_MODEL with your actual model (ex: llama3.2) ---
        const ollamaResp = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.2",
                prompt: user,
                stream: false
            })
        });

        const data = await ollamaResp.json();

        return res.json({
            text: data?.response || "AIX: रिकामा प्रतिसाद.",
            model: "llama3.2"
        });

    } catch (err) {
        console.error("AIX ERROR:", err);
        return res.json({ text: "AIX ERROR: Ollama चालू नाही किंवा backend error." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("🔥 Boss AIX Backend running on PORT:", PORT);
});
