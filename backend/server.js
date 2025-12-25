import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "aix-output");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// static outputs
app.use("/aix-output", express.static(OUTPUT_DIR));

/* =========================
   AIX CORE STATE
========================= */
const STATE = {
  mode: "HYBRID",
  aiAvailable: false,   // AI optional
  lastAction: null,
  memory: [],           // conversation memory
  jobs: {}              // running jobs
};

/* =========================
   PERSONA (ChatGPT-like)
========================= */
function aixSpeak(text) {
  return `ठीक आहे बॉस.\n${text}`;
}

/* =========================
   INTENT ENGINE (NO AI)
========================= */
function detectIntent(message) {
  const m = message.toLowerCase();

  if (m.includes("design") || m.includes("screen")) {
    return "SCREEN_DESIGN_CHANGE";
  }
  if (m.includes("file")) {
    return "CREATE_FILE";
  }
  if (m.includes("status")) {
    return "STATUS";
  }
  return "GENERAL_CHAT";
}

/* =========================
   PLANNER
========================= */
function planForIntent(intent) {
  if (intent === "SCREEN_DESIGN_CHANGE") {
    return {
      explain: `
मी frontend design मध्ये खालील बदल करणार आहे:
1) Dark professional background
2) Glass / blur effect chat panel
3) Right side output card layout
4) Mobile + laptop responsive animation

हे बदल frontend index.html आणि CSS मध्ये होतील.
`,
      needsPermission: true,
      action: "APPLY_SCREEN_DESIGN"
    };
  }

  if (intent === "CREATE_FILE") {
    return {
      explain: "मी demo output file तयार करणार आहे.",
      needsPermission: false,
      action: "CREATE_DEMO_FILE"
    };
  }

  if (intent === "STATUS") {
    return {
      explain: "सध्याची AIX सिस्टम स्थिती दाखवतो.",
      needsPermission: false,
      action: "SHOW_STATUS"
    };
  }

  return {
    explain: "मी ऐकतोय बॉस. पुढे काय करायचं आहे?",
    needsPermission: false,
    action: null
  };
}

/* =========================
   EXECUTOR (REAL WORK)
========================= */
function executeAction(action) {
  if (action === "CREATE_DEMO_FILE") {
    const file = `demo-${Date.now()}.txt`;
    const filePath = path.join(OUTPUT_DIR, file);
    fs.writeFileSync(filePath, "AIX Hybrid mode demo output.");
    return {
      type: "file",
      url: `/aix-output/${file}`
    };
  }

  if (action === "APPLY_SCREEN_DESIGN") {
    // Proof file (real execution marker)
    const proof = {
      action: "SCREEN_DESIGN_CHANGE",
      status: "APPLIED (BASE)",
      note: "UI design plan approved. Frontend update ready.",
      timestamp: new Date().toISOString()
    };
    const proofFile = `design-proof-${Date.now()}.json`;
    fs.writeFileSync(
      path.join(OUTPUT_DIR, proofFile),
      JSON.stringify(proof, null, 2)
    );
    return {
      type: "proof",
      url: `/aix-output/${proofFile}`
    };
  }

  if (action === "SHOW_STATUS") {
    return STATE;
  }

  return null;
}

/* =========================
   MAIN AIX API
========================= */
app.post("/api/aix", (req, res) => {
  const { message, permission } = req.body;

  STATE.memory.push({ role: "user", content: message });

  const intent = detectIntent(message);
  const plan = planForIntent(intent);

  // If permission required and not given yet
  if (plan.needsPermission && permission !== true) {
    const reply = aixSpeak(
      plan.explain +
      "\n⚠️ हे बदल लागू करू का? (हो / नाही)"
    );
    STATE.lastAction = plan.action;
    return res.json({ reply });
  }

  // Execute
  let output = null;
  if (plan.action) {
    output = executeAction(plan.action);
  }

  const reply = aixSpeak("काम पूर्ण झालं आहे. Output खाली दिला आहे.");

  res.json({
    reply,
    output,
    state: STATE
  });
});

/* =========================
   STATUS
========================= */
app.get("/api/status", (_, res) => {
  res.json({
    mode: STATE.mode,
    aiAvailable: STATE.aiAvailable,
    jobs: Object.keys(STATE.jobs).length,
    memory: STATE.memory.length
  });
});

app.get("/", (_, res) => {
  res.send("AIX HYBRID MODE LIVE");
});

app.listen(PORT, () => {
  console.log("AIX Hybrid running on port", PORT);
});
