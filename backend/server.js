import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* 🔥 HEALTH CHECK */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    name: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* 🔥 ROOT TEST */
app.get("/", (req, res) => {
  res.send("AIX Backend is LIVE");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("AIX server running on port", PORT);
});
