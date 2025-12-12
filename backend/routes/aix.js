import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const msg = req.body.message;

  if (!msg) {
    return res.json({ error: "MESSAGE_REQUIRED" });
  }

  // TEMP SMART AI RESPONSE (later autonomous system connect करू)
  const reply = `Boss AIX: मी तुझा मेसेज समजलो → ${msg}`;

  res.json({
    ok: true,
    reply
  });
});

export default router;
