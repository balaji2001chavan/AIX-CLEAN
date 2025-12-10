import express from "express";
const router = express.Router();

router.post("/command", (req, res) => {
  const { message, approve } = req.body;

  if (!message) {
    return res.status(400).json({ error: "NO MESSAGE" });
  }

  // STEP 1: PLAN
  if (!approve) {
    return res.json({
      step: 1,
      type: "PLAN",
      plan: `मी हे करणार आहे: "${message}". पुढे जाऊ का?`
    });
  }

  // STEP 2: ACTION
  return res.json({
    step: 2,
    type: "ACTION",
    result: `✅ आदेश पूर्ण केला: "${message}"`
  });
});

export default router;
