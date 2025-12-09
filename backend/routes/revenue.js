import express from "express";
import { recordTransaction, getSummary } from "../revenue/revenueEngine.js";

const router = express.Router();

router.post("/transaction", (req, res) => {
  const tx = req.body;
  const result = recordTransaction(tx);
  res.json({ status: "RECORDED", result });
});

router.get("/summary", (req, res) => {
  res.json(getSummary());
});

export default router;