// backend/auth/auth.routes.js
import express from "express";
const router = express.Router();

// Test simple login
router.post("/login", (req, res) => {
  res.json({
    status: "ok",
    message: "Auth route working",
    time: new Date().toISOString()
  });
});

export default router;
