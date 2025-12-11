import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// 🔥 FIX 1 – UNIVERSAL CORS (Render Frontend allowed)
app.use(cors({
  origin: [
    "https://boss-aix-frontend.onrender.com",
    "http://localhost:3000",
    "*"
  ],
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// 🔥 FIX 2 – CREATE WORKING /api/aix ENDPOINT
app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body.message || "";

    if (!message.trim()) {
      return res.json({ reply: "काहीतरी बोला मी ऐकतोय बॉस ❤️" });
    }

    // SIMPLE SMART AI RESPONSE (Later we connect Ollama/Groq)
    let reply = "";

    if (message.includes("कोण आहेस") || message.includes("who are you")) {
      reply = "मी Boss AIX — तुमचा स्मार्ट AI साथीदार 🔥";
    }
    else if (message.includes("चालू आहेस")) {
      reply = "हो बॉस, मी पूर्णपणे चालू आहे! आदेश द्या. 🚀";
    }
    else {
      reply = "मी इथे आहे बॉस, तुम्हाला मदत करण्यासाठी तयार आहे ❤️";
    }

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "AIX ERROR: काहीतरी गडबड झाली!" });
  }
});

// 🔥 START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Boss AIX Backend running on PORT ${PORT}`);
});
