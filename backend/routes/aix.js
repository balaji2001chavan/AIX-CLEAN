// backend/routes/aix.js
import express from "express";
import { brainResponse } from "../ai/brain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "MESSAGE_REQUIRED" });
    }

    const reply = await brainResponse(message);

    return res.json({
      boss: true,
      reply,
      message
    });

  } catch (err) {
    console.error("AIX ROUTE ERROR:", err);
    return res.status(500).json({ error: "AIX_FAILED" });
  }
});

export default router;
