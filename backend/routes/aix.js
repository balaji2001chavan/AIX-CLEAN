import express from "express";
import { brainResponse } from "../ai/brain.js";

const router = express.Router();

// AIX main brain endpoint
router.post("/", async (req, res) => {
  try {
    const message = req.body.message || "";

    if (!message.trim()) {
      return res.json({ error: "EMPTY MESSAGE" });
    }

    // Call AI brain
    const reply = await brainResponse(message);

    return res.json({
      ok: true,
      reply: reply || "AIX: मी इथे आहे! पुढचा आदेश दे 😊"
    });

  } catch (err) {
    console.error("AIX ERROR:", err);
    return res.status(500).json({ error: "AIX_INTERNAL_ERROR" });
  }
});

export default router;
