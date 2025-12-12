import express from "express";
import { autonomousAIX } from "../aix-autonomous.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const msg = req.body.message;
  if (!msg) return res.json({ error: "MESSAGE_REQUIRED" });

  const out = await autonomousAIX(msg);
  return res.json(out);
});

export default router;
