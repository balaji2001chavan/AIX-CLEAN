import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

/* 🔴 MOST IMPORTANT */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 8888;

/* HEALTH */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "AIX Backend",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* CHAT */
app.post("/api/chat", async (req, res) => {
  try {
    console.log("REQ BODY 👉", req.body);

    const message = req.body?.message;

    if (!message) {
      return res.json({
        reply: "मला काहीतरी विचार ना 😄"
      });
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are AIX, an intelligent Indian AI assistant. Reply like a human."
            },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await openaiRes.json();

    const reply =
      data?.choices?.[0]?.message?.content ??
      "AIX विचार करत आहे 🤖";

    res.json({ reply });

  } catch (err) {
    console.error("AIX ERROR ❌", err);
    res.status(500).json({
      reply: "AIX ला internal error आला 😅",
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log("✅ AIX Backend running on port", PORT);
});
