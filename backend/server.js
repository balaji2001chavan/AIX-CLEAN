import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

/* =====================
   HEALTH CHECK (JSON)
===================== */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "AIX",
    time: new Date().toISOString()
  });
});

/* =====================
   CHAT API
===================== */
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `🤖 AIX ऐकत आहे.\nतुमचा मेसेज: "${message}"`
  });
});

/* =====================
   FRONTEND SERVE
===================== */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* =====================
   SERVER START
===================== */
app.listen(PORT, () => {
  console.log(`🚀 AIX running on port ${PORT}`);
});
