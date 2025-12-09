import express from "express";
import cors from "cors";

import bossRoute from "./admin/boss.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.json({
    status: "BOSS AIX BACKEND LIVE"
  });
});

// ✅ Boss Admin Route
app.use("/api/boss", bossRoute);

// ✅ Start server
app.listen(PORT, () => {
  console.log("✅ Backend LIVE on http://localhost:" + PORT);
});