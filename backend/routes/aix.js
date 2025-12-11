import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const text = req.body.message || "";

    if (!text) {
      return res.json({ error: "EMPTY_MESSAGE" });
    }

    // Simple LLM call – upgrade करू पुढे
    const reply = `AIX बोलतोय: "${text}" मी समजलो, आता पुढील स्टेप सांग."`;

    return res.json({
      ok: true,
      reply,
      type: "normal"
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "AIX_ENGINE_FAILED",
      details: err.message
    });
  }
});

export default router;
