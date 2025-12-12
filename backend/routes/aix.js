import express from "express";
import { brainResponse } from "../ai/brain.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const msg = req.body.message;

    if (!msg) {
        return res.status(400).json({ error: "MESSAGE_REQUIRED" });
    }

    try {
        const reply = await brainResponse(msg);
        res.json({ boss: "AIX", reply });
    } catch (err) {
        res.status(500).json({ error: "AI_FAILED", details: err.message });
    }
});

export default router;
