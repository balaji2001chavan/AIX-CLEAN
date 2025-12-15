import express from "express";
import cors from "cors";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { selfChangeAction } from "./actions/selfChange.action.js";
import { createJob, getJob } from "./jobs/jobStore.js";
import { runFileCreateJob } from "./jobs/fileCreate.job.js";
import { runGitHubCommitJob } from "./jobs/githubCommit.job.js";
/* ================= APP ================= */
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 10000;
app.get("/api/job/:id", (req, res) => {
  const job = getJob(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});
/* ================= OPENAI ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


/* ================= AIX IDENTITY (VERY IMPORTANT) ================= */
const AIX_PROFILE = `
You are AIX (Action Intelligence X).

Owner: Boss
Nature: Global Intelligence + Real Action System

You are NOT a demo chatbot.
You are a long-term evolving system.

Your purpose:
- Speak like ChatGPT (human, deep, adaptive)
- Understand intent and emotion
- Remember previous conversations
- Understand the AIX project and improve it
- Suggest what to add, remove, or change
- Explain consequences before action
- Ask for approval before doing real work
- Do only legal, real-world digital actions

Boss gives high-level orders.
You decide HOW to do them.

Never ask repeatedly "what do you mean".
Use context and memory.
Speak Marathi / Hindi / English based on user.
`;

/* ================= MEMORY ================= */
// In-memory (phase 1)
let conversationMemory = [];

// limit memory size (safety)
function trimMemory() {
  if (conversationMemory.length > 20) {
    conversationMemory = conversationMemory.slice(-20);
  }
}

/* ================= SIMPLE ACTION: FILE CREATE ================= */
function createFileAction({ filename, content }) {
  const outputDir = path.join(process.cwd(), "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, content, "utf8");

  return {
    success: true,
    file: filename,
    path: `/output/${filename}`
  };
}

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.send("AIX CORE LIVE");
});

/* ================= MAIN AIX API ================= */
app.post("/api/aix", async (req, res) => {
  try {
    const userMessage = req.body.message?.trim();
    if (!userMessage) {
      return res.json({ reply: "काय सांगायचं आहे बॉस?" });
    }

    /* ===== CHECK APPROVAL ===== */
  if (
  conversationMemory.pendingJob &&
  ["हो","yes","ok","कर"].includes(userMessage.toLowerCase())
) {
  const { jobId, type, payload } = conversationMemory.pendingJob;
  conversationMemory.pendingJob = null;

  if (type === "GITHUB_COMMIT") {
    runGitHubCommitJob({ id: jobId }, payload);
    return res.json({
      reply: "GitHub job सुरू केलं आहे बॉस 🟢",
      job: getJob(jobId)
    });
  }
}
    if (
      conversationMemory.pendingAction &&
      ["हो", "yes", "ok", "कर", "करा"].includes(userMessage.toLowerCase())
    ) {
      const action = conversationMemory.pendingAction;
      conversationMemory.pendingAction = null;
if (lower.includes("फाइल बनव")) {
  const job = createJob("Create new file");

  conversationMemory.pendingJob = {
    jobId: job.id,
    type: "FILE_CREATE",
    payload: {
      filename: "aix-job-proof.txt",
      content: "This file is created by AIX Job Runner."
    }
  };
if (lower.includes("फाइल बनव")) {
  const job = createJob("Create new file");

  conversationMemory.pendingJob = {
    jobId: job.id,
    type: "FILE_CREATE",
    payload: {
      filename: "aix-job-proof.txt",
      content: "This file is created by AIX Job Runner."
    }
  };

  return res.json({
    reply:
      "बॉस, मी नवीन फाइल बनवण्याचं काम सुरू करू शकतो.\n" +
      "काम सुरू केल्यावर timer चालू होईल.\n" +
      "करू का?",
    job
  });
}
  return res.json({
    reply:
      "बॉस, मी नवीन फाइल बनवण्याचं काम सुरू करू शकतो.\n" +
      "काम सुरू केल्यावर timer चालू होईल.\n" +
      "करू का?",
    job
  });
}
      if (action.type === "CREATE_FILE") {
        const result = createFileAction(action.payload);
        return res.json({
          reply:
            "बॉस, काम झालं आहे ✅\nफाइल तयार केली आहे. खाली proof दिला आहे. वापरून पाहा.",
          proof: result
        });
      }
    }
// ===== SELF CHANGE EXECUTION =====
if (
  conversationMemory.pendingAction &&
  ["हो", "yes", "ok", "कर", "करा"].includes(userMessage.toLowerCase())
) {
  const action = conversationMemory.pendingAction;
  conversationMemory.pendingAction = null;

  if (action.type === "SELF_CHANGE") {
    const proof = selfChangeAction(action.payload);

    return res.json({
      reply:
        "बॉस, मी स्वतःसाठी बदलाचा प्लॅन तयार केला आहे ✅\n" +
        "हा माझा विचार आहे. पुढच्या स्टेपला execute करू का?",
      proof
    });
  }
}
    /* ===== STORE USER MESSAGE ===== */
    conversationMemory.push({ role: "user", content: userMessage });
    trimMemory();

    /* ===== OPENAI CALL WITH FULL CONTEXT ===== */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: AIX_PROFILE },
        ...conversationMemory
      ]
    });

    const aiReply = completion.choices[0].message.content;

    /* ===== STORE AI REPLY ===== */
    conversationMemory.push({ role: "assistant", content: aiReply });
    trimMemory();

    /* ===== INTENT DETECTION (REAL WORK) ===== */
    const lower = userMessage.toLowerCase();
if (lower.includes("github") || lower.includes("commit")) {
  const job = createJob("GitHub Commit");

  conversationMemory.pendingJob = {
    jobId: job.id,
    type: "GITHUB_COMMIT",
    payload: {
      paths: ["output/aix-job-proof.txt"],
      message: "AIX automated commit"
    }
  };

  return res.json({
    reply:
      "बॉस, बदल GitHub वर commit करू शकतो.\n" +
      "हे केल्यावर repo मध्ये लगेच दिसेल.\nकरू का?",
    job
  });
}
    if (
      lower.includes("फाइल बनव") ||
      lower.includes("create file")
    ) {
      conversationMemory.pendingAction = {
        type: "CREATE_FILE",
        payload: {
          filename: "aix-proof.txt",
          content:
            "This file is generated by AIX after understanding context and getting approval."
        }
      };
    }
if (
  lower.includes("स्वतः बदल") ||
  lower.includes("self change") ||
  lower.includes("काय बदल")
) {
  conversationMemory.pendingAction = {
    type: "SELF_CHANGE",
    payload: {
      title: "Improve AIX Project Structure",
      plan: {
        why:
          "सध्याचा प्रोजेक्ट वाढतोय. पुढे features वाढवण्यासाठी clarity आणि control आवश्यक आहे.",
        what:
          "Code analysis, action engines आणि memory modules वेगळे करणे.",
        how:
          "analysis/, actions/, memory/ असे modules बनवून refactor करणे.",
        result:
          "AIX अधिक smart होईल, बदल सोपे होतील आणि चुका कमी होतील."
      }
    }
  };
}
    return res.json({ reply: aiReply });

  } catch (err) {
    console.error("AIX ERROR:", err);
    return res.status(500).json({
      reply: "थोडी तांत्रिक अडचण आली बॉस. पुन्हा प्रयत्न करूया."
    });
  }
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("AIX Backend LIVE on port", PORT);
});
