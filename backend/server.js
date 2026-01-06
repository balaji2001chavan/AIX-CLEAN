import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

app.post("/api/aix/chat", (req, res) => {
  const { message } = req.body;
  res.json({
    reply: `AIX received: ${message}`,
    mode: "AGENTIC"
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`AIX backend running on ${PORT}`);
});
