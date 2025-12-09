import express from "express";
import { routeAI } from "../engine/llmRouter.js";

const router = express.Router();

router.post("/command", async (req, res) => {
  const text = req.body.text || "";

  const ai = await routeAI(text);

  res.json({
    boss: true,
    heard: text,
    used_model: ai.model,
    reason: ai.reason,
    reply: ai.reply
  });
});

export default router;