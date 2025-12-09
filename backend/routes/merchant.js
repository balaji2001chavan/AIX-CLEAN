import express from "express";
import { onboardMerchant } from "../merchants/onboardingEngine.js";

const router = express.Router();

router.post("/onboard", (req, res) => {
  const profile = req.body;
  const result = onboardMerchant(profile);
  res.json(result);
});

export default router;