import express from "express";
import { smartBrain } from "../ai/brain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const message = req.body.message?.trim();

    if (!message) {
      return res.status(400).json({ error: "MESSAGE_REQUIRED" });
    }

    const aiReply = await smartBrain(message);

    res.json({
      boss: true,
      message,
      reply: aiReply,
    });

  } catch (err) {
    console.error("🔥 AIX ROUTE ERROR:", err.message);

    res.status(500).json({
      error: "AIX_FAILED",
      fix: "AUTO_REPAIR_TRIGGERED",
      details: err.message,
    });
  }
});

export default router;
