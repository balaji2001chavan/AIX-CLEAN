import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { runAgent } from "./agent.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DB ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🧠 MongoDB Connected"))
  .catch(err => console.error("Mongo Error", err));

const MemorySchema = new mongoose.Schema({
  message: String,
  reply: String,
  createdAt: { type: Date, default: Date.now }
});
const Memory = mongoose.model("Memory", MemorySchema);

/* ================= HEALTH ================= */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "AIX Backend",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* ================= CHAT ================= */
app.post("/api/aix/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "Message नाही दिला ❌" });
    }

    const reply = await runAgent(message);

    await Memory.create({ message, reply });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AIX ला error आला 😵" });
  }
});

/* ================= START ================= */
const PORT = process.env.PORT || 8888;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AIX Backend running on ${PORT}`);
});
