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
const OUTPUT = path.join(ROOT, "backend", "output");

/* ================= SYSTEM STATE ================= */
const state = {
  aiAvailable: true,
  lastError: null,
  pendingAction: null,
  mode: "AUTO-HYBRID",
  uptime: Date.now()
};

/* ================= OPENAI (SAFE) ================= */
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  state.aiAvailable = false;
}

/* ================= UTILS ================= */
function ensureOutput() {
  if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT, { recursive: true });
}

function createFile(name, content) {
  ensureOutput();
  const filePath = path.join(OUTPUT, name);
  fs.writeFileSync(filePath, content, "utf8");
  return `/backend/output/${name}`;
}

function systemStatus() {
  return {
    mode: state.mode,
    aiAvailable: state.aiAvailable,
    pendingAction: state.pendingAction ? "YES" : "NO",
    lastError: state.lastError,
    uptimeSeconds: Math.floor((Date.now() - state.uptime) / 1000)
  };
}

function isSimple(text) {
  return /^(हो|status|help|health)$/i.test(text.trim());
}

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({
    service: "AIX AUTO-OPERATE CORE",
    status: systemStatus()
  });
});

/* ================= AIX MAIN ================= */
app.post("/api/aix", async (req, res) => {
  const user = (req.body.message || "").trim();
  if (!user) return res.json({ reply: "काय करायचं आहे बॉस?" });

  /* ===== NO-AI COMMANDS (0 TOKEN) ===== */
  if (isSimple(user)) {
    if (user.toLowerCase() === "status" || user === "health") {
      return res.json({
        reply:
          "🟢 लाईव्ह सिस्टम स्टेटस:\n" +
          JSON.stringify(systemStatus(), null, 2)
      });
    }

    if (user === "help") {
      return res.json({
        reply:
          "मी फाइल तयार करतो, proof देतो, planner बनवतो.\n" +
          "काम सांग → मी plan देईन → 'हो' लिही."
      });
    }
  }

  /* ===== APPROVAL ===== */
  if (user === "हो" && state.pendingAction) {
    const job = state.pendingAction;
    state.pendingAction = null;

    if (job.type === "CREATE_PROOF") {
      const filePath = createFile(job.file, job.content);
      const proof = {
        success: true,
        file: job.file,
        path: filePath,
        timestamp: new Date().toISOString()
      };
      createFile("proof.json", JSON.stringify(proof, null, 2));

      return res.json({
        reply:
          "✅ काम पूर्ण झालं.\n" +
          `File: ${filePath}\n` +
          "Proof: /backend/output/proof.json"
      });
    }
  }

  /* ===== ACTION WITHOUT AI ===== */
  if (/file|proof|demo|planner/i.test(user)) {
    state.pendingAction = {
      type: "CREATE_PROOF",
      file: "planner-demo.txt",
      content: "AIX auto-operated proof file."
    };

    return res.json({
      reply:
        "मी रियल फाइल + proof तयार करू शकतो.\n" +
        "करू का बॉस?"
    });
  }

  /* ===== AI MODE (SAFE, LIMITED) ===== */
  if (!openai) {
    state.lastError = "AI unavailable (API key missing or limited)";
    return res.json({
      reply:
        "⚠️ AI सध्या उपलब्ध नाही.\n" +
        "पण core सिस्टम चालू आहे.\n" +
        "status लिहून तपासा."
    });
  }

  try {
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 350,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are AIX. Be practical. Explain problems and solutions."
        },
        { role: "user", content: user }
      ]
    });

    return res.json({
      reply: ai.choices[0].message.content
    });

  } catch (err) {
    state.aiAvailable = false;
    state.lastError = err.message;

    return res.json({
      reply:
        "⚠️ AI rate-limit किंवा error आला आहे.\n" +
        "AIX auto-safe mode मध्ये गेला आहे.\n" +
        "status लिहून तपासा."
    });
  }
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("🚀 AIX AUTO-OPERATE running on", PORT);
});
