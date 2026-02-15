import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { aixAgent } from "./agent.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* HEALTH */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "AIX Backend",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* CHAT */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({
      reply: "काय विचारायचं आहे ते लिही. मी ऐकतोय 🙂"
    });
  }

  try {
    const reply = await aixAgent(message);
    res.json({ reply });
  } catch (err) {
    res.json({
      reply: "काहीतरी चुकलं. पण काळजी नको, मी स्वतः ते fix करतोय.",
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AIX Backend running on ${PORT}`);
});
