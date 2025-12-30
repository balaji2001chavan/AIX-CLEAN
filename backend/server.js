import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import aixController from "./controllers/aix.controller.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error", err));

/* ================= ROUTES ================= */
app.post("/api/aix/chat", aixController.chat);

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({
    status: "AIX CORE LIVE",
    mode: "HYBRID-INTELLIGENCE",
    providers: ["OpenAI", "Gemini", "HuggingFace"]
  });
});

/* ================= START ================= */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 AIX server running on port ${PORT}`);
});
