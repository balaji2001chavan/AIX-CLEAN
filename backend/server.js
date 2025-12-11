// ------------------------------
// BOSS AIX - SMART BACKEND
// ------------------------------

import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// ⭐ ALLOW FRONTEND (Render domain)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// ROOT CHECK
app.get("/", (req, res) => {
    res.json({
        ok: true,
        msg: "Boss AIX Backend LIVE"
    });
});

// ------------------------------
// ⭐ THE REQUIRED API: /api/aix
// ------------------------------
app.post("/api/aix", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.json({ error: "EMPTY MESSAGE", reply: "काय म्हणताय बॉस?" });
        }

        // TEMP NORMAL AI REPLY (until Ollama connected)
        const smartReply = `Boss AIX: मी ऐकले → "${message}" आणि मी तुमची मदत करण्यासाठी तयार आहे!`;

        res.json({
            ok: true,
            heard: message,
            reply: smartReply
        });

    } catch (err) {
        res.json({ error: "SERVER ERROR", details: err.message });
    }
});

// ------------------------------
// START SERVER
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Boss AIX Backend running on PORT ${PORT}`);
});
