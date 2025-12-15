import express from "express";
import cors from "cors";
import path from "path";

/* ================= CORE ================= */
import { parseCommand } from "./aix-core/core/command-engine/parseCommand.js";
import { getState, updateState } from "./aix-core/core/state-engine/stateManager.js";
import { createPlan } from "./aix-core/core/planner/planner.js";

/* ================= JOB ENGINE ================= */
import {
  createJob,
  getJob
} from "./jobs/jobStore.js";

import { runFileCreateJob } from "./jobs/fileCreate.job.js";
import { runGitHubCommitJob } from "./jobs/githubCommit.job.js";

/* ================= APP ================= */
const app = express();
app.use(cors());
app.use(express.json());

/* ================= MEMORY ================= */
let conversationMemory = {
  pendingJob: null
};

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.send("AIX MASTER SERVER IS LIVE");
});

/* ================= JOB STATUS API ================= */
app.get("/api/job/:id", (req, res) => {
  const job = getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(job);
});

/* =====================================================
   MAIN AIX COMMAND ENDPOINT
===================================================== */
app.post("/api/aix", async (req, res) => {
  try {
    const userMessage = req.body.message || "";
    const lower = userMessage.toLowerCase();

    const command = parseCommand(userMessage);
    const plan = createPlan(command);

    /* ========== APPROVAL HANDLER ========== */
    if (
      conversationMemory.pendingJob &&
      ["हो", "yes", "ok", "कर"].includes(lower)
    ) {
      const { jobId, type, payload } = conversationMemory.pendingJob;
      conversationMemory.pendingJob = null;

      if (type === "FILE_CREATE") {
        runFileCreateJob({ id: jobId }, payload);
        updateState("File create job started");

        return res.json({
          reply: "🟢 फाइल तयार करण्याचं काम सुरू केलं आहे बॉस",
          job: getJob(jobId),
          state: getState()
        });
      }

      if (type === "GITHUB_COMMIT") {
        runGitHubCommitJob({ id: jobId }, payload);
        updateState("GitHub commit job started");

        return res.json({
          reply: "🟢 GitHub commit सुरू केलं आहे बॉस",
          job: getJob(jobId),
          state: getState()
        });
      }
    }

    /* ========== FILE CREATE INTENT ========== */
    if (
      lower.includes("नवीन फाइल") ||
      lower.includes("file बनव")
    ) {
      const job = createJob("Create Proof File");

      conversationMemory.pendingJob = {
        jobId: job.id,
        type: "FILE_CREATE",
        payload: {
          filename: "aix-job-proof.txt",
          content:
            "This file is created by AIX as a real proof of execution."
        }
      };

      return res.json({
        reply:
          "बॉस, मी proof फाइल तयार करणार आहे.\n" +
          "काम सुरू केल्यावर status दिसेल.\n" +
          "करू का?",
        job,
        state: getState()
      });
    }

    /* ========== GITHUB COMMIT INTENT ========== */
    if (
      lower.includes("github वर commit") ||
      lower.includes("git commit")
    ) {
      const job = createJob("GitHub Commit");

      conversationMemory.pendingJob = {
        jobId: job.id,
        type: "GITHUB_COMMIT",
        payload: {
          filename: "aix-job-proof.txt",
          message: "AIX proof file commit"
        }
      };

      return res.json({
        reply:
          "बॉस, ही फाइल GitHub वर commit करणार आहे.\n" +
          "केल्यावर repo मध्ये लगेच दिसेल.\n" +
          "करू का?",
        job,
        state: getState()
      });
    }

    /* ========== DEFAULT AI REPLY ========== */
    return res.json({
      reply:
        "बॉस, मी ऐकतोय.\n" +
        "तुम्ही रियल काम सांगू शकता (फाइल, GitHub, पुढे deploy).\n" +
        "पुढे काय करू?",
      command,
      plan,
      state: getState()
    });

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
  console.log("AIX MASTER Backend running on port", PORT);
});
