import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(express.json());

// ⭐ FINAL CORS FIX (Render allowed)
app.use(
  cors({
    origin: [
      "https://boss-aix-frontend.onrender.com",
      "http://localhost:3000",
      "*"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// TEST ROUTE
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// ⭐ MAIN API
app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body.message || "Hello";

    // call to ollama or groq (replace as per your setup)
    const reply = `AIX Reply: मी ऑनलाइन आहे. तुम्ही म्हणाल ते मी समजून करीन.`;

    res.json({
      success: true,
      reply,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "AIX INTERNAL ERROR",
      detail: err.message,
    });
  }
});

// RUN SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Boss AIX Backend running on ${PORT}`));
