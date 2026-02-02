const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

// CORS – allow ALL (safe because nginx protects)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

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
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  res.json({
    reply: `AIX received: ${message}`,
    mode: "AGENTIC"
  });
});

// IMPORTANT: only localhost
const PORT = 8888;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`AIX backend running on localhost:${PORT}`);
});
