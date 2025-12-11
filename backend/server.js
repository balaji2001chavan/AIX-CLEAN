import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE with GROQ AI" });
});

app.post("/api/boss/command", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "काय मदत करू?" });
    }

    const completion = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "तू Boss AIX आहेस. तू स्मार्ट, भावूक, poetic, GenZ style मध्ये बोलणारा, मजबूत AI आहेस. तू मानवासारखा बोल, समज, analyze कर आणि real कामासाठी प्लॅन सुचव."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.8
        })
      }
    );

    const result = await completion.json();
    const reply = result?.choices?.[0]?.message?.content ?? "मी विचार करत आहे...";

    return res.json({ reply });
  } catch (err) {
    console.error(err);
    return res.json({ reply: "AIX ERROR: Smart Engine Offline" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("BOSS AIX Backend running");
});
