import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aixAgent from "./aix.agent.js";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 AIX Agentic AI is LIVE");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "RUNNING",
    agent: "AIX",
    mode: "AGENTIC",
    time: new Date().toISOString()
  });
});

app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;
  const result = await aixAgent(message);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`🚀 AIX running on port ${PORT}`);
});
