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
let pending = null;

/* ================= PATH ================= */
const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "backend", "output");

/* ================= UTILS ================= */
function ensureOutput() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function createFile(name, content) {
  ensureOutput();
  const filePath = path.join(OUTPUT_DIR, name);
  fs.writeFileSync(filePath, content, "utf8");
  return `/backend/output/${name}`;
}

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.send("AIX HYBRID FINAL LIVE");
});

/* ================= AIX CORE ================= */
app.post("/api/aix", async (req, res) => {
  try {
    const user = (req.body.message || "").trim();
    if (!user) {
      return res.json({ reply: "काय करायचं आहे बॉस?" });
    }

    /* ===== APPROVAL STEP ===== */
    if (pending && user.toLowerCase() === "हो") {
      const job = pending;
      pending = null;

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
            "✅ रियल काम पूर्ण झालं आहे.\n\n" +
            `File: ${filePath}\n` +
            "Proof: /backend/output/proof.json\n" +
            "वापरून पाहा."
        });
      }
    }

    /* ===== MEMORY (LOW TOKEN) ===== */
    memory.push({ role: "user", content: user });
    if (memory.length > 4) memory = memory.slice(-4);

    /* ===== AI THINKING (LOW TOKEN PROMPT) ===== */
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
You are AIX.
You are a practical Indian AI Operator.
You do not hallucinate.
You explain first, then ask permission.
You only do real, legal actions.
`
        },
        ...memory
      ]
    });

    const reply = ai.choices[0].message.content;
    memory.push({ role: "assistant", content: reply });

    /* ===== SIMPLE INTENT ===== */
    if (/file|proof|planner|demo/i.test(user)) {
      pending = {
        type: "CREATE_PROOF",
        file: "planner-demo.txt",
        content:
          "This file was created by AIX as a real proof of execution."
      };

      return res.json({
        reply:
          reply +
          "\n\nमी एक रियल फाइल आणि proof तयार करू शकतो.\n" +
          "करू का बॉस?"
      });
    }

    return res.json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      reply: "AIX मध्ये तांत्रिक अडचण आली आहे."
    });
  }
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("🚀 AIX Hybrid Final running on", PORT);
});
