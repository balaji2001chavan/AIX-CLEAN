import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

let memory = [];

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX LLM Server LIVE ✅" });
});

// ----------------------------
// TALK TO OLLAMA (REAL BRAIN)
// ----------------------------
async function talkToAI(message) {
  const payload = {
    model: "llama3.2:1b",
    prompt: `
You are Boss AIX.
You talk like a friendly, smart human.
You explain things clearly.
You respond in the same language as the user.
Be natural, helpful and conversational.

Conversation:
${memory.join("\n")}

User: ${message}
Boss AIX:
`,
    stream: false
  };

  const r = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await r.json();
  return data.response || "मला थोडं अडचण येतेय, परत विचाराल का?";
}

// ----------------------------
// MAIN CHAT API
// ----------------------------
app.post("/api/boss/command", async (req, res) => {
  const message = req.body.message || "";

  memory.push("User: " + message);
  if (memory.length > 8) memory.shift();

  try {
    const reply = await talkToAI(message);

    memory.push("Boss AIX: " + reply);

    res.json({
      text: reply,
      human: true
    });
  } catch (e) {
    console.error(e);
    res.json({
      text: "⚠️ AI मेंदूशी कनेक्ट होत नाही. Ollama चालू आहे का?"
