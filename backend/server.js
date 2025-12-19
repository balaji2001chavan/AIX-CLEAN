import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { execSync } from "child_process";
import { addToMemory, getMemory } from "./memory/memoryStore.js";
import { AIX_TOOLS } from "./tools/toolRegistry.js";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 10000;

/* ================= OPENAI ================= */
const pastMemory = getMemory();

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0.7,
  messages: [
    {
      role: "system",
      content: `
You are AIX.
You know your own capabilities and limits.

Your tools:
${AIX_TOOLS.map(t => `- ${t.name}: ${t.description}`).join("\n")}

You explain clearly what you can do.
You guide the user how to grow AIX to world-class level.
`
    },
    ...pastMemory.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage }
  ]
});

/* ================= MEMORY ================= */
let memory = [];
let pendingAction = null;

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.send("AIX MASTER AI LIVE");
});

/* ================= MAIN AI ================= */
app.post("/api/aix", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("USER:", userMessage);

    if (!userMessage) {
      return res.json({ reply: "काय मदत हवी आहे बॉस?" });
    }

    /* ---------- APPROVAL ---------- */
    if (
      pendingAction &&
      ["हो", "yes", "ok", "कर"].includes(userMessage.toLowerCase())
    ) {
      const action = pendingAction;
      pendingAction = null;

      /* FILE CREATE */
      if (action.type === "FILE_CREATE") {
        const dir = path.join(process.cwd(), "backend", "output");
        fs.mkdirSync(dir, { recursive: true });
        const filePath = path.join(dir, "aix-proof.txt");
        fs.writeFileSync(
          filePath,
          "This proof file is created by AIX.",
          "utf8"
        );

        return res.json({
          reply:
            "✅ बॉस, फाइल तयार झाली आहे.\n" +
            "Path: backend/output/aix-proof.txt\n" +
            "वापरून पाहा."
        });
      }

      /* GITHUB COMMIT */
      if (action.type === "GITHUB_COMMIT") {
        execSync(`git add backend/output/aix-proof.txt`);
        execSync(`git commit -m "AIX proof commit"`);
        execSync(`git push origin main`);

        return res.json({
          reply:
            "✅ GitHub वर commit झाला आहे.\n" +
            "Proof: https://github.com/balaji2001chavan/AIX-CLEAN/commits/main\n" +
            "वापरून पाहा."
        });
      }
    }

    /* ---------- AI BRAIN ---------- */
    memory.push({ role: "user", content: userMessage });
    if (memory.length > 12) memory = memory.slice(-12);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are AIX.
You speak like ChatGPT.
You are practical, honest, and human-like.
You explain what is possible and what is not.
You suggest actions and ask before doing them.
You think in business, technology, and reality.
`
        },
        ...memory
      ]
    });

    const aiReply = completion.choices[0].message.content;
    memory.push({ role: "assistant", content: aiReply });

    /* ---------- ACTION SUGGEST ---------- */
    let suggestion = null;
    if (aiReply.toLowerCase().includes("file")) {
      suggestion = { type: "FILE_CREATE" };
    }
    if (aiReply.toLowerCase().includes("github")) {
      suggestion = { type: "GITHUB_COMMIT" };
    }

    if (suggestion) {
      pendingAction = suggestion;
      return res.json({
        reply:
          aiReply +
          "\n\nहे काम मी रियल करू शकतो.\nकरू का बॉस?"
      });
    }

    return res.json({ reply: aiReply });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "AIX मध्ये तांत्रिक अडचण आली आहे."
    });
  }
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("🚀 AIX MASTER AI running on port", PORT);
});
