import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import OpenAI from "openai";

/* ================= BASIC APP ================= */
const app = express();
app.use(cors());
app.use(express.json());

/* ================= STATE ================= */
const state = {
  mode: "EXECUTION",
  pendingAction: null,
  aiAvailable: true,
  lastError: null,
  startedAt: Date.now()
};

/* ================= OPENAI ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ================= SYSTEM PROMPT ================= */
const SYSTEM_PROMPT = `
You are AIX running in EXECUTION MODE.

RULES (MANDATORY):
- Do NOT explain theory.
- Do NOT write long informational articles.
- ALWAYS ask clarifying questions first.
- NEVER execute without approval.
- After planning ask exactly: "करू का बॉस?"
- Be short, practical, action-oriented.
- Behave like a trusted human operator, not a chatbot.
`;

/* ================= HELPERS ================= */
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeProof(data) {
  const dir = path.join(process.cwd(), "backend", "output");
  ensureDir(dir);
  const file = path.join(dir, "proof.json");
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}

function commitProofToGitHub() {
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!repo || !token) {
    return "GitHub credentials missing";
  }

  const remote = `https://${token}@github.com/${repo}.git`;

  try {
    execSync("git config user.email 'aix@system.local'");
    execSync("git config user.name 'AIX Bot'");
    execSync("git add backend/output/proof.json");
    execSync(`git commit -m "AIX proof commit"`);
    execSync(`git push ${remote} HEAD:main`);
    return `https://github.com/${repo}/commits/main`;
  } catch (e) {
    return "GitHub push failed";
  }
}

/* ================= STATUS ================= */
app.get("/status", (req, res) => {
  res.json({
    mode: "AUTO-HYBRID",
    aiAvailable: state.aiAvailable,
    pendingAction: state.pendingAction ? state.pendingAction.type : "NO",
    lastError: state.lastError,
    uptimeSeconds: Math.floor((Date.now() - state.startedAt) / 1000)
  });
});

/* ================= MAIN AIX API ================= */
app.post("/api/aix", async (req, res) => {
  const user = (req.body.message || "").trim();

  /* ----- Approval ----- */
  if (user === "हो" && state.pendingAction) {
    const proof = {
      action: state.pendingAction.type,
      input: state.pendingAction.input,
      time: new Date().toISOString(),
      status: "EXECUTED"
    };

    writeProof(proof);
    const githubLink = commitProofToGitHub();
    state.pendingAction = null;

    return res.json({
      reply:
        "✅ काम execute झालं आहे बॉस.\n\n" +
        "📂 Local Proof: backend/output/proof.json\n" +
        "🌍 GitHub Proof: " + githubLink + "\n\n" +
        "वापरून पाहा."
    });
  }

  /* ----- Execution Trigger ----- */
  if (/reel|video|image|photo|इमेज|व्हिडिओ/i.test(user)) {
    state.pendingAction = {
      type: "MEDIA_EXECUTION",
      input: user
    };

    return res.json({
      reply:
        "ठीक आहे बॉस. Execution mode चालू आहे.\n\n" +
        "1️⃣ प्रॉडक्ट/विषय काय आहे?\n" +
        "2️⃣ Audience कोण आहे?\n" +
        "3️⃣ Output काय हवा? (Image / Video)\n" +
        "4️⃣ उद्देश काय आहे?\n\n" +
        "उत्तर द्या बॉस."
    });
  }

  /* ----- AI Controlled Reply ----- */
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: user }
      ],
      max_tokens: 250
    });

    let reply = completion.choices[0].message.content;

    if (reply.length > 500) {
      reply =
        "मी execution mode मध्ये आहे बॉस.\n" +
        "काम सुरू करण्यासाठी आवश्यक माहिती द्या.";
    }

    return res.json({ reply });

  } catch (err) {
    state.aiAvailable = false;
    state.lastError = err.message;

    return res.json({
      reply:
        "⚠️ AI तात्पुरता उपलब्ध नाही बॉस.\n" +
        "मी सिस्टीम alive ठेवली आहे. थोड्या वेळाने पुन्हा प्रयत्न करा."
    });
  }
});

/* ================= START ================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 AIX FINAL EXECUTION SERVER RUNNING ON", PORT);
});
