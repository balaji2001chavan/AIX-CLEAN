import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ================= OPENAI ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ================= STATE ================= */
let memory = [];
let pendingAction = null;

/* ================= REPO ROOT ================= */
const REPO_ROOT = process.cwd();

/* ================= HELPERS ================= */
function readRepo(limit = 30) {
  const files = [];

  function walk(dir) {
    if (files.length >= limit) return;

    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (files.length >= limit) break;

      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        if (["node_modules", ".git"].includes(item.name)) continue;
        walk(fullPath);
      } else if (item.name.endsWith(".js")) {
        try {
          const content = fs.readFileSync(fullPath, "utf8");
          files.push({
            file: fullPath.replace(REPO_ROOT + "/", ""),
            content: content.slice(0, 3000)
          });
        } catch {}
      }
    }
  }

  walk(REPO_ROOT);
  return files;
}

function createProofFile(filename, content) {
  const outDir = path.join(REPO_ROOT, "backend", "output");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, content, "utf8");

  return `/backend/output/${filename}`;
}

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.send("AIX SERVER LIVE");
});

/* ================= MAIN AIX ================= */
app.post("/api/aix", async (req, res) => {
  try {
    const userMsg = (req.body.message || "").trim();
    if (!userMsg) {
      return res.json({ reply: "काय करायचं आहे बॉस?" });
    }

    /* ===== APPROVAL STEP ===== */
    if (pendingAction && userMsg.toLowerCase() === "हो") {
      const action = pendingAction;
      pendingAction = null;

      if (action.type === "CREATE_FILE") {
        const filePath = createProofFile(
          action.filename,
          action.content
        );

        return res.json({
          reply:
            "✅ रियल फाइल तयार झाली आहे.\n" +
            `Path: ${filePath}\n` +
            "वापरून पाहा."
        });
      }
    }

    memory.push({ role: "user", content: userMsg });
    if (memory.length > 10) memory = memory.slice(-10);

    const repoSnapshot = readRepo();

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `
You are AIX.
You speak like a smart Indian assistant.
You analyze repository code.
You suggest real, legal, practical actions.
You always ask permission before execution.
`
        },
        {
          role: "system",
          content: `Repository snapshot:\n${JSON.stringify(repoSnapshot)}`
        },
        ...memory
      ]
    });

    const reply = ai.choices[0].message.content;
    memory.push({ role: "assistant", content: reply });

    /* ===== SIMPLE ACTION DETECTION ===== */
    if (/file|proof|create/i.test(userMsg)) {
      pendingAction = {
        type: "CREATE_FILE",
        filename: "aix-proof.txt",
        content: "This proof file was created by AIX."
      };

      return res.json({
        reply:
          reply +
          "\n\nमी एक रियल proof फाइल तयार करू शकतो.\n" +
          "करू का बॉस?"
      });
    }

    return res.json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      reply: "AIX मध्ये तांत्रिक अडचण आली आहे."
    });
  }
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("🚀 AIX running on port", PORT);
});
