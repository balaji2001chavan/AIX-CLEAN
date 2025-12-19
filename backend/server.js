import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { execSync } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 10000;

/* ============ OPENAI ============ */
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing");
}

/* ============ STATE ============ */
let memory = [];
let pending = null; // { type, data }

/* ============ HELPERS ============ */
const REPO_ROOT = path.join(process.cwd(), "backend"); // repo view scope

function readRepoSnapshot(maxFiles = 50) {
  const out = [];
  function walk(dir) {
    if (out.length >= maxFiles) return;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const it of items) {
      if (out.length >= maxFiles) break;
      const p = path.join(dir, it.name);
      if (it.isDirectory()) {
        if (["node_modules", ".git"].includes(it.name)) continue;
        walk(p);
      } else {
        if (!/\.(js|json|md|txt)$/i.test(it.name)) continue;
        try {
          const c = fs.readFileSync(p, "utf8");
          out.push({ file: p.replace(process.cwd()+"/",""), content: c.slice(0, 4000) });
        } catch {}
      }
    }
  }
  walk(REPO_ROOT);
  return out;
}

function applyPatch(filePath, newContent) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, newContent, "utf8");
}

/* ============ HEALTH ============ */
app.get("/", (_, res) => res.send("AIX MASTER LIVE"));

/* ============ MAIN ============ */
app.post("/api/aix", async (req, res) => {
  try {
    const user = (req.body.message || "").trim();
    if (!user) return res.json({ reply: "काय करायचं आहे बॉस?" });

    // APPROVAL
    if (pending && ["हो","yes","ok","कर"].includes(user.toLowerCase())) {
      const job = pending; pending = null;

      if (job.type === "APPLY_PATCH") {
        const { file, content, commitMsg } = job.data;
        applyPatch(file, content);
        execSync(`git add ${file}`);
        execSync(`git commit -m "${commitMsg}"`);
        execSync(`git push origin main`);
        return res.json({
          reply:
            "✅ बदल लागू केले आणि GitHub वर commit केला.\n" +
            "Proof: https://github.com/balaji2001chavan/AIX-CLEAN/commits/main\n" +
            "वापरून पाहा."
        });
      }
    }

    // MEMORY
    memory.push({ role: "user", content: user });
    if (memory.length > 12) memory = memory.slice(-12);

    // REPO SNAPSHOT (read-only)
    const snapshot = readRepoSnapshot();

    // AI BRAIN
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content: `
You are AIX, an AI Engineer & Operator.
You read the repository snapshot, explain issues, propose concrete fixes,
show before/after, ask approval, then apply changes with proof.
Never claim impossible powers. Be practical.
`
        },
        { role: "system", content: `Repository snapshot:\n${JSON.stringify(snapshot)}` },
        ...memory
      ]
    });

    const reply = completion.choices[0].message.content;
    memory.push({ role: "assistant", content: reply });

    // Simple action detection (patch intent)
    if (/fix|repair|improve|refactor|bug/i.test(reply)) {
      // Ask AI for a concrete patch
      const patch = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: "Propose ONE concrete patch. Output JSON only." },
          { role: "user", content:
`Target one file. Provide:
{
 "file": "backend/...",
 "newContent": "...",
 "commitMsg": "..."
}` }
        ]
      });

      try {
        const data = JSON.parse(patch.choices[0].message.content);
        pending = { type: "APPLY_PATCH", data };
        return res.json({
          reply:
            reply +
            "\n\nमी हा बदल रियल लागू करू शकतो.\n" +
            `File: ${data.file}\nCommit: ${data.commitMsg}\n` +
            "करू का बॉस?"
        });
      } catch {
        return res.json({ reply });
      }
    }

    return res.json({ reply });

  } catch (e) {
    console.error(e);
    res.status(500).json({ reply: "AIX मध्ये तांत्रिक अडचण आली आहे." });
  }
});

app.listen(PORT, () => console.log("🚀 AIX running on", PORT));
