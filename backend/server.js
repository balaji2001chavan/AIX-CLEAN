import express from "express";
import cors from "cors";

const app = express();
const PORT = 8080;

// middlewares
app.use(cors());
app.use(express.json());

// health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

// main AIX chat endpoint
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // 🔥 AIX core logic (v1)
  let reply = "";

  if (message.toLowerCase().includes("introduce")) {
    reply =
      "I am AIX — your advisor, engineer, and executor. I learn, explain, ask before fixing, and execute real tasks.";
  } else if (message.toLowerCase().includes("grow")) {
    reply =
      "I grow by learning from instructions, adding tools, connecting APIs, automating tasks, and evolving with technology.";
  } else {
    reply = `AIX heard you: "${message}". Next step: tell me what real action you want.`;
  }

  res.json({
    reply,
    mode: "AGENTIC",
    timestamp: Date.now()
  });
});

// start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AIX server running on http://0.0.0.0:${PORT}`);
});
