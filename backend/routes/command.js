import express from "express";
import { generatePlan } from "../aix/planGenerator.js";
import { savePlan } from "../aix/approvalStore.js";
import crypto from "crypto";

const router = express.Router();

/**
 * PHASE 2 – PLAN + APPROVAL READY
 */
router.post("/", async (req, res) => {
  const command = req.body?.command;

  if (!command || !command.trim()) {
    return res.json({
      type: "ERROR",
      message: "EMPTY COMMAND"
    });
  }

  try {
    const plan = await generatePlan(command);

    const planId = crypto.randomUUID();
    savePlan(planId, plan);

    return res.json({
      type: "PLAN",
      planId,
      plan,
      approval: "REQUIRED"
    });
  } catch (err) {
    return res.json({
      type: "ERROR",
      message: err.message
    });
  }
});

export default router;