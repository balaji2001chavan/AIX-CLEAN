import express from "express";
import { generatePlan } from "../engines/plan.engine.js";
import { executeAction } from "../engines/action.engine.js";

const router = express.Router();

router.post("/command", (req, res) => {
  const { message, approve } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message" });
  }

  const plan = generatePlan(message);

  if (!approve) {
    return res.json({
      step: "PLAN",
      plan
    });
  }

  const result = executeAction(plan.plan);
  res.json({
    step: "ACTION",
    result
  });
});

export default router;
