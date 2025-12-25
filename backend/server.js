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
const OUTPUT_DIR = path.join(ROOT, "aix-output");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

app.use("/aix-output", express.static(OUTPUT_DIR));

/* ============ BRAIN ============ */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are AIX.
You speak like ChatGPT: clear, calm, intelligent.
You understand Marathi, Hindi, English.
First explain.
If real work is needed, respond ONLY in JSON like:
{
  "action": "create_demo_file",
  "content": "text"
}
`;

/* ============ MEMORY ============ */
const session = {
  messages: []
};

/* ============ JOB STORE ============ */
const JOBS = {};

/* ============ EXECUTOR ============ */
function execute(plan) {
  if (plan.action === "create_demo_file") {
    const file = `demo-${Date.now()}.txt`;
    const filePath = path.join(OUTPUT_DIR, file);
    fs.writeFileSync(filePath, plan.content || "AIX demo output");
    return {
      type: "file",
      url: `/aix-output/${file}`
    };
  }
  return null;
}

/* ============ API ============ */
app.post("/api/aix", async (req, res) => {
  const { message } = req.body;

  session.messages.push({ role: "user", content: message });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...session.messages
    ],
    temperature: 0.6
  });

  const reply = completion.choices[0].message.content;
  session.messages.push({ role: "assistant", content: reply });

  let output = null;

  try {
    const plan = JSON.parse(reply);
    const jobId = "job_" + Date.now();
    JOBS[jobId] = { status: "RUNNING" };

    const result = execute(plan);
    JOBS[jobId] = { status: "DONE", result };

    output = { jobId, ...result };
  } catch (e) {
    // normal chat
  }

  res.json({
    reply,
    output
  });
});

app.get("/api/jobs", (_, res) => {
  res.json(JOBS);
});

app.get("/", (_, res) => {
  res.send("AIX LIVE STUDIO BACKEND RUNNING");
});

app.listen(PORT, () => {
  console.log("AIX backend live on", PORT);
});
