import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// MAIN AIX ROUTE
app.post("/api/aix", async (req, res) => {
  try {
    const user = req.body.message;

    // CLOUD AI MODEL (replace with your API key)
    const reply = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are Boss AIX — सर्वात स्मार्ट, हुशार, भविष्य ओळखणारा, मानवासारखा बोलणारा, मराठीत किंवा वापरकर्ता ज्या भाषेत बोलेल त्या भाषेत reply देणारा AI सहाय्यक."
          },
          { role: "user", content: user }
        ]
      })
    });

    const data = await reply.json();
    const output = data.choices[0].message.content;

    res.json({ ai: output });
  } catch (err) {
    console.error(err);
    res.json({ ai: "AIX ERROR: Backend processing failed." });
  }
});

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "AIX Backend LIVE" });
});

app.listen(5000, () => console.log("AIX Backend Running on 5000"));
