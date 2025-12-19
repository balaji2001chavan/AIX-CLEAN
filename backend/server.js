import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

/* ================== BASIC STATE ================== */
const state = {
  mode: "EXECUTION",
  pendingAction: null,
  lastError: null,
  aiAvailable: true,
  uptimeStart: Date.now()
};

/* ================== OPENAI ================== */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ================== SYSTEM PROMPT (CRITICAL) ================== */
const SYSTEM_PROMPT = `
You are AIX in EXECUTION MODE.

STRICT RULES:
- You are NOT a teacher or advisor.
- Do NOT explain theory.
- ALWAYS ask clarifying questions first.
- NEVER finalize without approval.
- After planning, ask exactly: "करू का बॉस?"
- Keep replies short and action-oriented.
`;

/* ================== STATUS ================== */
app.get("/status", (req, res) => {
  res.json({
    mode: "AUTO-HYBRID",
    aiAvailable: state.aiAvailable,
    pendingAction: state.pendingAction ? state.pendingAction.type : "NO",
    lastError: state.lastError,
    uptimeSeconds: Math.floor((Date.now() - state.uptimeStart) / 1000)
  });
});

/* ================== MAIN AIX ENDPOINT ================== */
app.post("/api/aix", async (req, res) => {
  const user = (req.body.message || "").trim();

  /* ---------- STATUS QUICK ---------- */
  if (user.toLowerCase() === "status") {
    return res.json({
      reply: JSON.stringify({
        mode: "AUTO-HYBRID",
        aiAvailable: state.aiAvailable,
        pendingAction: state.pendingAction ? state.pendingAction.type : "NO",
        lastError: state.lastError
      }, null, 2)
    });
  }

  /* ---------- APPROVAL ---------- */
  if (user === "हो" && state.pendingAction) {
    const proofDir = path.join(process.cwd(), "backend", "output");
    fs.mkdirSync(proofDir, { recursive: true });

    const proof = {
      action: state.pendingAction.type,
      input: state.pendingAction.input,
      timestamp: new Date().toISOString(),
      status: "EXECUTED"
    };

    fs.writeFileSync(
      path.join(proofDir, "proof.json"),
      JSON.stringify(proof, null, 2)
    );

    state.pendingAction = null;

    return res.json({
      reply:
        "✅ काम execute झालं आहे बॉस.\n\n" +
        "📂 Proof: /backend/output/proof.json\n" +
        "वापरून पाहा."
    });
  }

  /* ---------- EXECUTION FLOW TRIGGER ---------- */
  if (/reel|video|image|photo|इमेज|व्हिडिओ/i.test(user)) {
    state.pendingAction = {
      type: "MEDIA_EXECUTION",
      input: user
    };

    return res.json({
      reply:
        "ठीक आहे बॉस. Execution mode चालू आहे.\n\n" +
        "1️⃣ प्रॉडक्ट/विषय काय आहे?\n" +
        "2️⃣ Output काय हवा? (Image / Video)\n" +
        "3️⃣ Audience कोण आहे?\n" +
        "4️⃣ उद्देश काय आहे?\n\n" +
        "उत्तर द्या बॉस."
    });
  }

  /* ---------- AI FALLBACK (SHORT ONLY) ---------- */
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: user }
      ],
      max_tokens: 200
    });

    let reply = completion.choices[0].message.content;

    // Guardrail: long explanation block
    if (reply.length > 400) {
      reply =
        "मी execution mode मध्ये आहे.\n" +
        "आधी आवश्यक प्रश्नांची उत्तरं द्या बॉस.";
    }

    return res.json({ reply });

  } catch (err) {
    state.aiAvailable = false;
    state.lastError = err.message;

    return res.json({
      reply:
        "⚠️ AI तात्पुरता उपलब्ध नाही बॉस.\n" +
        "मी माहिती गोळा करून ठेवतो. थोड्या वेळाने पुन्हा प्रयत्न करा."
    });
  }
});

/* ================== START ================== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AIX EXECUTION SERVER RUNNING ON", PORT);
});
