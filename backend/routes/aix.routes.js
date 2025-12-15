import express from "express";

/*
  This route file is kept ONLY to satisfy old imports.
  Old aix.controller is deprecated.
*/

const router = express.Router();

router.post("/", (req, res) => {
  res.json({
    success: false,
    message: "Old /aix route is deprecated. Use /api/aix or /api/aix-apx."
  });
});

export default router;
