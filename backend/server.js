import express from "express";
import cors from "cors";
import path from "path";

/* ================= CORE ================= */
import { parseCommand } from "./aix-core/core/command-engine/parseCommand.js";
import { createPlan } from "./aix-core/core/planner/planner.js";

/* ================= STATE ================= */
const state = {
  project: "AIX",
  history: []
};

/* ================= CONVERSATION MEMORY ================= */
const conversation = [];

function addMessage(role, text) {
  conversation.push({
    role,
    text,
    time: new Date().toISOString()
  });
  if (conversation.length > 20) conversation.shift();
}

function getConversation() {
  return conversation;
}

/* ================= INSPECT / FIX ================= */
import { inspectProject } from "./aix-core/inspectors/projectInspector.js";
import { applyFix } from "./aix-core/inspectors/applyFix.js";

/* ================= EXECUTORS ================= */
import { takeScreenshot } from "./aix-core/executors/web/screenshot.js";
import { createFile } from "./aix-core/executors/files/createFile.js";
import { searchKnowledge } from "./aix-core/executors/knowledge/searchKnowledge.js";

/* ================= MEDIA ================= */
import { generateRealImage } from "./aix-core/executors/media/realImageGenerator.js";
import { generateRealVideo } from "./aix-core/executors/media/realVideoGenerator.js";

/* ================= APP ================= */
const app = express();
app.use(cors());
app.use(express.json());

app.use("/aix-output", express.static(path.join(process.cwd(), "aix-output")));

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.send("AIX CORE IS LIVE");
});

/* =====================================================
   MAIN AIX CHAT + COMMAND API
===================================================== */
app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body.message || "";
    addMessage("user", message);

    const command = parseCommand(message);
    const plan = createPlan(command);

    let result = "No execution";

    /* ---------- INSPECT ---------- */
    if (command.goal?.toLowerCase().includes("inspect")) {
      const report = inspectProject(process.cwd());
      result = report.summary;
      state.history.push("Project inspected");

      addMessage("aix", result);
      return res.json({ result, findings: report.findings, conversation });
    }

    /* ---------- FIX ---------- */
    if (command.goal?.toLowerCase().includes("fix")) {
      const match = command.goal.match(/[A-Z_]+/);
      if (match) {
        result = applyFix(match[0]);
        state.history.push(`Fix applied: ${match[0]}`);
      } else {
        result = "Fix code सापडला नाही";
      }

      addMessage("aix", result);
      return res.json({ result, conversation });
    }

    /* ---------- SCREENSHOT ---------- */
    if (
      command.output?.toLowerCase().includes("screenshot") ||
      command.goal?.toLowerCase().includes("screenshot")
    ) {
      const img = await takeScreenshot(command.url || "https://example.com");
      result = "Screenshot taken";

      addMessage("aix", result);
      return res.json({ result, imageUrl: img, conversation });
    }

    /* ---------- KNOWLEDGE (CHAT STYLE) ---------- */
    if (
      command.output?.toLowerCase().includes("knowledge") ||
      command.goal?.length > 0
    ) {
      const data = await searchKnowledge(command.goal);
      result = data.summary;

      addMessage("aix", result);
      return res.json({
        result,
        sources: data.sources,
        conversation
      });
    }

    /* ---------- REAL IMAGE ---------- */
    if (command.output?.toLowerCase().includes("image")) {
      try {
        const img = await generateRealImage(command.goal);
        result = "Image generated";

        addMessage("aix", result);
        return res.json({ result, imageUrl: img, conversation });
      } catch (e) {
        result = "Image generation failed";
        addMessage("aix", result);
        return res.json({ result, error: e.message, conversation });
      }
    }

    /* ---------- VIDEO JOB ---------- */
    if (command.output?.toLowerCase().includes("video")) {
      const video = generateRealVideo(command.goal);
      result = "Video job created";

      addMessage("aix", result);
      return res.json({ result, videoJob: video.jobFile, conversation });
    }

    /* ---------- DEFAULT CHAT ---------- */
    addMessage("aix", result);
    return res.json({ result, conversation });

  } catch (err) {
    console.error("AIX ERROR:", err);
    return res.status(500).json({
      error: "AIX internal error",
      details: err.message
    });
  }
});

/* ================= START ================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AIX Backend running on port", PORT);
});
