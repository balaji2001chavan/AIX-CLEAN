import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    OK: true,
    message: "✅ HEALTH ROUTE WORKING ✅",
    time: new Date().toISOString()
  });
});

export default router;