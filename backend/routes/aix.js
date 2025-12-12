import express from "express";
import { AIX_SOUL } from "../system/AIX-SOUL.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.json({ error: "MESSAGE_REQUIRED" });

        const response = await AIX_SOUL(message);
        res.json(response);

    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

export default router;
