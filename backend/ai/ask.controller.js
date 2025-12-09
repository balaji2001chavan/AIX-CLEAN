import express from "express";

const router = express.Router();

router.post("/ask", async (req, res) => {
  const { input } = req.body;

  // Basic sample response
  res.json({
    status: "ok",
    reply: `तुझा मेसेज मिळाला: ${input}`
  });
});

export default router;
