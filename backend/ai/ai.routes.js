import express from "express";
import { runAIX } from "./engine.js";

export const router = express.Router();

// AI Ask Route
router.post("/ask", async (req, res) => {
    try {
        const { prompt, userId } = req.body;

        if (!prompt) {
            return res.json({ reply: "AIX: रिक्वेस्टमध्ये prompt नाही बॉस." });
        }

        const reply = await runAIX(prompt, userId || "default");

        return res.json({ reply });
    } catch (err) {
        console.error("AIX ERROR:", err);
        return res.status(500).json({ reply: "AIX: बॉस, सिस्टमला अडथळा आला." });
    }
});