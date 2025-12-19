import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const app = express();

/* ================= SECURITY (NO EXTRA PKG) ================= */
const ALLOW_ORIGINS = [
  "https://boss-aix-frontend.onrender.com",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOW_ORIGINS.includes(origin)) cb(null, true);
    else cb(new Error("CORS blocked"));
  }
}));

app.use(express.json({ limit: "256kb" }));

/* ================= SIMPLE RATE CONTROL ================= */
const requests = new Map();
app.use((req, res, next) => {
  const ip = req.ip || "local";
  const now = Date.now();
  const windowMs = 60_000;

  const arr = requests.get(ip) || [];
  const recent = arr.filter(t => now - t < windowMs);
  recent.push(now);
  requests.set(ip, recent);

  if (recent.length > 60) {
    return res.status(429).json({ error: "Too many requests" });
  }
  next();
});

/* ================= STATE ================= */
let job = null;
const STARTED_AT = Date.now();

/* ================= PATHS ================= */
const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUTPUT = path.join(PUBLIC, "output");

fs.mkdirSync(OUTPUT, { recursive: true });

/* ================= AUDIT ================= */
function audit(msg) {
  fs.appendFileSync(
    path.join(ROOT, "audit.log"),
    `[${new Date().toISOString()}] ${msg}\n`
  );
}

/* ================= STATUS ================= */
app.get("/api/status", (req, res) => {
  res.json({
    mode: "AUTO-HYBRID",
    running: !!job,
    job,
    uptimeSeconds: Math.floor((Date.now() - STARTED_AT) / 1000)
  });
});

/* ================= LOGS ================= */
app.get("/api/logs", (req, res) => {
  res.json(job?.logs || []);
});

/* ================= START JOB ================= */
import { exec } from "child_process";

// ...

app.post("/api/start", (req, res) => {
  const { type } = req.body || {};
  if (!["video", "image"].includes(type)) {
    return res.status(400).json({ error: "Invalid job type" });
  }

  job = {
    id: crypto.randomUUID(),
    type,
    logs: ["Job accepted", "Planning"],
    output: null,
    startedAt: Date.now()
  };
  audit(`JOB_START ${job.id} ${type}`);

  // Paths
  const out = path.join(OUTPUT, "demo.mp4");
  const img = path.join(OUTPUT, "frame.png");

  // 1) Create a frame (image)
  setTimeout(() => {
    job.logs.push("Rendering frame");
    exec(
      `ffmpeg -y -f lavfi -i color=c=black:s=1080x1920:d=1 -vf "drawtext=text='AIX • REAL VIDEO':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2" ${img}`,
      () => {
        // 2) Convert frame → MP4 (15 sec)
        job.logs.push("Encoding MP4");
        exec(
          `ffmpeg -y -loop 1 -i ${img} -t 15 -vf "scale=1080:1920,format=yuv420p" ${out}`,
          () => {
            job.logs.push("Output ready");
            job.output = "/output/demo.mp4";
            audit(`JOB_DONE ${job.id}`);
          }
        );
      }
    );
  }, 500);

  res.json({ success: true, jobId: job.id });
});

  // simulate generation
  setTimeout(() => {
    const out = path.join(OUTPUT, "demo.mp4");
    fs.writeFileSync(out, "DEMO OUTPUT");
    job.logs.push("Output ready");
    job.output = "/output/demo.mp4";
    audit(`JOB_DONE ${job.id}`);
  }, 3000);

  res.json({ success: true, jobId: job.id });
});

/* ================= STATIC ================= */
app.use("/output", express.static(OUTPUT));
app.use(express.static(PUBLIC));

/* ================= FALLBACK ================= */
app.use((err, req, res, next) => {
  audit(`ERROR ${err.message}`);
  res.status(400).json({ error: "Request blocked" });
});

/* ================= START ================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🔒 AIX Secure Server running on port", PORT);
});
