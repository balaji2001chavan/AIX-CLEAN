import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.json({
    OK: true,
    MESSAGE: "✅ /api/repair ROUTE IS WORKING ✅"
  });
});

export default router;