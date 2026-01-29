import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* =======================
   GLOBAL MIDDLEWARE
======================= */
app.use(express.json());

app.use(cors({
  origin: [
    "https://boss-aix-frontend.vercel.app",
    "https://allinonestopdeals.com"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

/* =======================
   HEALTH CHECK (MANDATORY)
======================= */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "AIX Backend",
    time: new Date().toISOString()
  });
});

/* =======================
   AIX CHAT ENDPOINT
======================= */
app.post("/api/aix/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // TEMP SMART REPLY (API जोडल्यावर replace होईल)
    const reply = `AIX received: "${message}". Backend is healthy and operational.`;

    res.json({
      reply,
      mode: "AGENTIC",
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("AIX ERROR:", err);
    res.status(500).json({ error: "AIX internal error" });
  }
});

/* =======================
   SERVER START
======================= */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AIX Backend running on port ${PORT}`);
});
