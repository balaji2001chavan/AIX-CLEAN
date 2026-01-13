import express from "express";
import cors from "cors";

const app = express();
const PORT = 8080;

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

/**
 * 🔥 CRITICAL LINE 🔥
 * THIS IS THE WHOLE PROBLEM FIX
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AIX server running on 0.0.0.0:${PORT}`);
});
