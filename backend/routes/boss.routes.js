import express from "express";
import { thinkLikeHuman } from "../ai/brain.js";

const router = express.Router();

// simple in-memory context
let memory = [];

router.post("/command", async (req, res) => {
  try {
    const { message, approve } = req.body;

    if (!message) {
      return res.status(400).json({ error: "NO MESSAGE" });
    }

    const aiReply = await thinkLikeHuman(message, memory);

    memory.push({ role: "user", content: message });
    memory.push({ role: "assistant", content: aiReply });

    // STEP 1: PLAN
    if (!approve) {
      return res.json({
        ok: true,
        step: "PLAN",
        text: aiReply,          // ✅ ALWAYS use "text"
        ask: "पुढे जायचं असेल तर 'हो' सांगा"
      });
    }

    // STEP 2: ACTION
    return res.json({
      ok: true,
      step: "ACTION",
      text: aiReply,
      result: "✅ काम पूर्ण केलं"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: "AI ERROR"
    });
  }
});

export default router;
