import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "public", "output");
fs.mkdirSync(OUTPUT, { recursive: true });

let currentJob = null;

/* ========== LIVE STATUS ========== */
app.get("/api/status", (req, res) => {
  res.json({
    running: !!currentJob,
    job: currentJob
  });
});

/* ========== START JOB ========== */
app.post("/api/start", (req, res) => {
  const { type } = req.body;

  currentJob = {
    type,
    logs: ["Job started"],
    output: null,
    startedAt: Date.now()
  };

  // simulate video generation
  setTimeout(() => {
    currentJob.logs.push("Rendering video...");
  }, 1500);

  setTimeout(() => {
    const demoVideo = path.join(OUTPUT, "demo.mp4");
    fs.writeFileSync(demoVideo, "FAKE VIDEO DATA");

    currentJob.output = "/output/demo.mp4";
    currentJob.logs.push("Video ready");

    // proof commit (optional)
    try {
      execSync("git add .");
      execSync("git commit -m 'AIX live proof'");
    } catch {}

  }, 3500);

  res.json({ ok: true });
});

/* ========== LIVE LOGS (POLL) ========== */
app.get("/api/logs", (req, res) => {
  res.json(currentJob?.logs || []);
});

/* ========== STATIC FILES ========== */
app.use("/output", express.static(OUTPUT));
app.use(express.static("public"));

/* ========== START ========== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("🔥 AIX LIVE STUDIO running on", PORT)
);
