// =======================
// AIX FINAL SERVER.JS
// =======================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import OpenAI from "openai";

// ---------- BASIC SETUP ----------
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ---------- PATH FIX (ESM) ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ---------- FRONTEND SERVE ----------
app.use(
  express.static(
    path.join(__dirname, "../frontend")
  )
);

// ---------- HEALTH CHECK (IMPORTANT) ----------
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    server: "AIX",
    time: new Date().toISOString()
  });
});

// ---------- MONGODB (OPTIONAL) ----------
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err =>
      console.error("❌ MongoDB error:", err.message)
    );
} else {
  console.log("⚠️ MongoDB URI not set – running without DB");
}

// ---------- OPENAI SAFE INIT ----------
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log("✅ OpenAI ready");
} else {
  console.log("⚠️ OPENAI_API_KEY missing – AI replies will be mock");
}

// ---------- AIX CHAT API ----------
app.post("/api/aix/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({
        reply: "Message missing"
      });
    }

    // ---- If OpenAI available ----
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are AIX. You speak like ChatGPT but focus on real execution and clear answers."
          },
          { role: "user", content: userMessage }
        ]
      });

      return res.json({
        reply:
          completion.choices[0].message.content
      });
    }

    // ---- Fallback (no API key) ----
    return res.json({
      reply:
        "AIX is running. AI key not connected yet, but server + frontend are live."
    });
  } catch (err) {
    console.error("❌ AIX error:", err.message);
    res.status(500).json({
      reply: "AIX internal error"
    });
  }
});

// ---------- DEFAULT FALLBACK ----------
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// ---------- START SERVER ----------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AIX server running on port ${PORT}`);
});
