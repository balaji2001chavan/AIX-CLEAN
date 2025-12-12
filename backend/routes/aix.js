import express from "express";
import { runBrain } from "../ai/brain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "MESSAGE_REQUIRED" });
    }

    const reply = await runBrain(message);

    res.json({
      ok: true,
      reply
    });

  } catch (e) {
    console.error("AIX ROUTE ERROR:", e);
    res.status(500).json({ error: "AIX_INTERNAL_ERROR" });
  }
});

export default router;
