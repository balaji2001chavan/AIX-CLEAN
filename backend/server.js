import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

/* HEALTH CHECK */
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "AIX",
    status: "ONLINE",
    time: new Date().toISOString()
  });
});

/* BASIC CHAT TEST */
app.post("/api/aix/chat", (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `AIX received: ${message}`,
    timestamp: new Date().toISOString()
  });
});

/* 404 FALLBACK */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AIX server running on port ${PORT}`);
});
