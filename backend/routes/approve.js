import express from "express";
import { getPlan, updateStatus } from "../aix/approvalStore.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { planId, decision } = req.body;

  if (!planId || !decision) {
    return res.json({ error: "planId and decision required" });
  }

  const updated = updateStatus(planId, decision);

  if (!updated) {
    return res.json({ error: "Plan not found" });
  }

  return res.json({
    status: updated.status,
    plan: updated.plan
  });
});

export default router;