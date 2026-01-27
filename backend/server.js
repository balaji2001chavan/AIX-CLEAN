import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    mode: "AGENTIC"
  });
});

app.post("/api/aix/chat", async (req, res) => {
  const userMessage = req.body.message;

  const systemPrompt = `
You are AIX.
You are an autonomous Agentic AI.
You act as:
- Advisor
- Engineer
- Executor

Rules:
- Speak like a friendly human
- Explain before acting
- Ask before fixing or changing anything
- Think step by step
- Suggest improvements proactively
- Stay updated with current technology and world events
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]
  });

  res.json({
    reply: response.choices[0].message.content,
    agent: "AIX",
    intelligence: "OPENAI-GPT"
  });
});

app.listen(8080, "0.0.0.0", () => {
  console.log("AIX server running on port 8080");
});
