import express from "express";
import { brainResponse } from "../ai/brain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const msg = req.body.message;
    if (!msg) return res.status(400).json({ error: "MESSAGE_REQUIRED" });

    const reply = await brainResponse(msg);
    return res.json({ reply });

  } catch (err) {
    return res.status(500).json({ error: "AIX_ERROR", details: err.message });
  }
});

export default router;
