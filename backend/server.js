import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { brainResponse } from "./ai/brain.js";

const app = express();

// ---------------------
// CORS FIX – REQUIRED
// ---------------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());

// ---------------------
// HEALTH CHECK
// ---------------------
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// -------------------------
// MAIN AIX ROUTE (FRONTEND calls this)
// -------------------------
app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ error: "MESSAGE_REQUIRED" });
    }

    const reply = await brainResponse(message);

    res.json({
      boss: true,
      reply: reply,
      heard: message
    });

  } catch (err) {
    console.error("AIX ERROR:", err);
    res.status(500).json({ error: "AIX_FAILED", details: err.message });
  }
});

// ---------------------
// START SERVER
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Boss AIX Backend running on port", PORT);
});
