import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* =====================
   BASIC MIDDLEWARE
===================== */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());

/* =====================
   ROOT CHECK
===================== */
app.get("/", (req, res) => {
  res.send("✅ AIX Backend is LIVE");
});

/* =====================
   HEALTH CHECK
===================== */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    server: "AIX",
    time: new Date().toISOString(),
  });
});

/* =====================
   AIX CHAT (DUMMY SAFE)
   (Frontend connect test)
===================== */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message required",
    });
  }

  res.json({
    reply: `👋 बॉस, AIX ऐकत आहे. तुम्ही म्हणालात: "${message}"`,
    mode: "ONLINE",
  });
});

/* =====================
   SERVER START
===================== */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 AIX server running on port ${PORT}`);
});
