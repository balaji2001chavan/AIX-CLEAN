import express from "express";
import { getPlan } from "../aix/approvalStore.js";
import { safeWriteFile } from "../aix/executor.js";

const router = express.Router();

/**
 * PHASE 3X — REAL EXECUTION (SAFE)
 */
router.post("/", (req, res) => {
  const { planId } = req.body;

  if (!planId) {
    return res.json({ error: "planId missing" });
  }

  const record = getPlan(planId);

  if (!record || record.status !== "APPROVED") {
    return res.json({ error: "Plan not approved" });
  }

  // ✅ DEMO REAL ACTION
  const result = safeWriteFile(
    "generated_apps/demo.txt",
    record.plan
  );

  return res.json({
    executed: true,
    result
  });
});

export default router;