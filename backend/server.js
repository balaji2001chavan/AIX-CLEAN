import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "aix-output");
if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT);

app.use("/aix-output", express.static(OUTPUT));

/* ================= BRAIN ================= */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are AIX.
You speak like ChatGPT: clear, calm, intelligent.
You understand Marathi, Hindi, English.
You explain first, then ask before executing.
If execution is needed, respond with JSON like:
{
  "action": "create_file",
  "content": "text to write"
}
`;

/* ================= SESSION ================= */

const SESSION = {
  messages: []
};

/* ================= EXECUTOR ================= */

function executePlan(plan) {
  if (plan.action === "create_file") {
    const file = `output-${Date.now()}.txt`;
    fs.writeFileSync(
      path.join(OUTPUT, file),
      plan.content || "AIX executed task"
    );
    return `/aix-output/${file}`;
  }
  return null;
}

/* ================= API ================= */

app.post("/api/aix", async (req, res) => {
  const userMsg = req.body.message;

  SESSION.messages.push({ role: "user", content: userMsg });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...SESSION.messages
    ],
    temperature: 0.6
  });

  const reply = completion.choices[0].message.content;
  SESSION.messages.push({ role: "assistant", content: reply });

  let preview = null;

  // If AI returned JSON plan → execute
  try {
    const plan = JSON.parse(reply);
    preview = executePlan(plan);
  } catch (e) {
    // normal chat reply
  }

  res.json({
    reply,
    preview
  });
});

app.get("/", (_, res) => {
  res.send("AIX FINAL – Brain + Executor LIVE");
});

app.listen(PORT, () => {
  console.log("AIX running on port", PORT);
});
