import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8888;

// HEALTH
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "AIX Backend",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

// CHAT
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "मला काहीतरी विचार 😄" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are AIX, a smart Indian AI assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "AIX सध्या विचार करत आहे 🤖";

    res.json({ reply });

  } catch (err) {
    res.json({
      reply: "AIX ला थोडा त्रास झाला 😅 पुन्हा try कर",
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log("AIX Backend running on port", PORT);
});
