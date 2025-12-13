import express from "express";
import { askAI } from "./ask.controller.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt missing" });

    const reply = await askAI(prompt);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "AI failed", detail: err.message });
  }
});

export default router;
