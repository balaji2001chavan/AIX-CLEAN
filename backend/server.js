// ===============================
// AIX FINAL SERVER
// ===============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// -------------------------------
// MIDDLEWARE
// -------------------------------
app.use(cors());
app.use(express.json());

// -------------------------------
// HEALTH CHECK
// -------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    ai: "AIX",
    mode: "online",
    time: new Date().toISOString()
  });
});

// -------------------------------
// AIX CHAT ENDPOINT
// -------------------------------
app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // Basic intelligent reply (safe fallback)
    let reply =
      "नमस्कार बॉस. मी AIX आहे. मी ऐकतोय. कृपया स्पष्ट आदेश किंवा प्रश्न द्या.";

    // If OpenAI key exists, use AI
    if (process.env.OPENAI_API_KEY) {
      const { default: OpenAI } = await import("openai");

      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are AIX, a smart Indian AI assistant. Speak politely, clearly, and practically in Marathi/English mixed style."
          },
          {
            role: "user",
            content: message
          }
        ]
      });

      reply = completion.choices[0].message.content;
    }

    return res.json({
      ai: "AIX",
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("AIX ERROR:", err.message);
    return res.status(500).json({
      error: "AIX internal error",
      details: err.message
    });
  }
});

// -------------------------------
// MONGODB (OPTIONAL)
// -------------------------------
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) =>
      console.error("MongoDB connection failed:", err.message)
    );
} else {
  console.log("MongoDB skipped (MONGODB_URI not set)");
}

// -------------------------------
// START SERVER
// -------------------------------
app.listen(PORT, () => {
  console.log(`AIX server running on port ${PORT}`);
});
