import express from "express";
import { thinkLikeHuman } from "../ai/brain.js";

const router = express.Router();

let memory = [];

router.post("/command", async (req, res) => {
  const { message, approve } = req.body;

  if (!message) {
    return res.status(400).json({ error: "NO MESSAGE" });
  }

  // AI THINKING
  const aiReply = await thinkLikeHuman(message, memory);

  memory.push({ role: "user", content: message });
  memory.push({ role: "assistant", content: aiReply });

  // PLAN
  if (!approve) {
    return res.json({
      step: "PLAN",
      ai: aiReply,
      plan: "मी हे काम करणार आहे. पुढे जाऊ का?"
    });
  }

  // ACTION
  return res.json({
    step: "ACTION",
    ai: aiReply,
    result: "✅ आदेश अंमलात आणला"
  });
});

export default router;
