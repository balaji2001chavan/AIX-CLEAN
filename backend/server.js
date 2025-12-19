import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { exec } from "child_process";

/* ================= BOOT ================= */
const app = express();
const PORT = process.env.PORT || 10000;
const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUTPUT = path.join(PUBLIC, "output");

fs.mkdirSync(OUTPUT, { recursive: true });

/* ================= BASIC SECURITY ================= */
const ALLOW = [
  "https://boss-aix-frontend.onrender.com",
  "http://localhost:3000"
];

app.use(cors({
  origin: (o, cb) => (!o || ALLOW.includes(o)) ? cb(null, true) : cb(new Error("Blocked"))
}));

app.use(express.json({ limit: "256kb" }));

/* ================= LIGHT RATE CONTROL ================= */
const RATE = new Map();
app.use((req, res, next) => {
  const ip = req.ip || "local";
  const now = Date.now();
  const win = 60_000;
  const arr = (RATE.get(ip) || []).filter(t => now - t < win);
  arr.push(now);
  RATE.set(ip, arr);
  if (arr.length > 300) return res.status(429).json({ error: "Slow down" });
  next();
});

/* ================= AIX MEMORY ================= */
let JOB = null;
const STARTED = Date.now();

/* ================= UTILS ================= */
function log(msg) {
  if (JOB) JOB.logs.push(msg);
  fs.appendFileSync(path.join(ROOT, "audit.log"),
    `[${new Date().toISOString()}] ${msg}\n`
  );
}

/* ================= AIX STATUS ================= */
app.get("/api/status", (req, res) => {
  res.json({
    mode: "AIX-SMART",
    running: !!JOB,
    job: JOB,
    uptimeSeconds: Math.floor((Date.now() - STARTED) / 1000)
  });
});

app.get("/api/logs", (req, res) => {
  res.json(JOB?.logs || []);
});

/* ================= SMART COMMAND ================= */
/*
  Intelligence flow:
  1. Accept goal
  2. Plan
  3. Execute allowed action
  4. Proof
*/
app.post("/api/command", (req, res) => {
  const { goal } = req.body || {};
  if (!goal) return res.status(400).json({ error: "Goal required" });

  const id = crypto.randomUUID();
  JOB = {
    id,
    goal,
    plan: [],
    logs: [],
    output: null,
    startedAt: Date.now()
  };

  log("Goal received");
  log("Planning…");

  // --- Simple intelligence routing ---
  if (goal.toLowerCase().includes("video")) {
    JOB.plan.push("Create vertical MP4");
    executeVideo();
  } else if (goal.toLowerCase().includes("image")) {
    JOB.plan.push("Create image");
    executeImage();
  } else {
    log("No executable action found");
  }

  res.json({
    accepted: true,
    jobId: id,
    plan: JOB.plan
  });
});

/* ================= EXECUTORS ================= */
function executeVideo() {
  const img = path.join(OUTPUT, "frame.png");
  const out = path.join(OUTPUT, "demo.mp4");

  log("Rendering frame");

  exec(
    `ffmpeg -y -f lavfi -i color=c=black:s=1080x1920:d=1 -vf "drawtext=text='AIX SMART INTELLIGENCE':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2" ${img}`,
    () => {
      log("Encoding video");
      exec(
        `ffmpeg -y -loop 1 -i ${img} -t 15 -vf "scale=1080:1920,format=yuv420p" ${out}`,
        () => {
          JOB.output = "/output/demo.mp4";
          log("Output ready");
          log("Execution complete");
        }
      );
    }
  );
}

function executeImage() {
  const img = path.join(OUTPUT, "image.png");
  log("Rendering image");
  exec(
    `ffmpeg -y -f lavfi -i color=c=blue:s=1024x1024:d=1 -vf "drawtext=text='AIX IMAGE':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2" ${img}`,
    () => {
      JOB.output = "/output/image.png";
      log("Output ready");
    }
  );
}

/* ================= STATIC ================= */
app.use("/output", express.static(OUTPUT));
app.use(express.static(PUBLIC));

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("🧠 AIX SMART SERVER RUNNING ON", PORT);
});
