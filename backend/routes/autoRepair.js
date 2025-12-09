import express from "express";
import { applyFix } from "../aix/autoRepair.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { fix, approved } = req.body;

  if (!approved) {
    return res.json({ status: "WAITING_FOR_APPROVAL" });
  }

  try {
    const result = applyFix(fix);
    return res.json({
      status: "REPAIRED",
      result
    });
  } catch (err) {
    return res.json({
      status: "FAILED",
      error: err.message
    });
  }
});

export default router;