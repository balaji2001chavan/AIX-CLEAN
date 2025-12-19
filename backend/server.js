import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import rateLimit from "express-rate-limit";

const app = express();

/* ===== SECURITY ===== */
const ALLOW_ORIGINS = [
  "https://boss-aix-frontend.onrender.com",
  "http://localhost:3000"
];
app.use(cors({
  origin: (o, cb) => (!o || ALLOW_ORIGINS.includes(o)) ? cb(null, true) : cb(new Error("CORS blocked")),
  methods: ["GET","POST"]
}));
app.use(express.json({ limit: "256kb" }));
app.use(rateLimit({ windowMs: 60_000, max: 60 })); // 60 req/min

/* ===== STATE ===== */
let job = null;
const STARTED_AT = Date.now();

/* ===== PATHS ===== */
const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUTPUT = path.join(PUBLIC, "output");
fs.mkdirSync(OUTPUT, { recursive: true });

/* ===== HELPERS ===== */
function audit(line){
  const f = path.join(ROOT, "audit.log");
  fs.appendFileSync(f, `[${new Date().toISOString()}] ${line}\n`);
}
function safeJob(type){
  return ["video","image"].includes(type);
}

/* ===== STATUS ===== */
app.get("/api/status", (req,res)=>{
  res.json({
    mode:"AUTO-HYBRID",
    running:!!job,
    job,
    uptimeSeconds: Math.floor((Date.now()-STARTED_AT)/1000)
  });
});

/* ===== LOGS ===== */
app.get("/api/logs", (req,res)=>{
  res.json(job?.logs || []);
});

/* ===== START JOB (WHITELISTED) ===== */
app.post("/api/start",(req,res)=>{
  const { type } = req.body || {};
  if(!safeJob(type)) return res.status(400).json({error:"Invalid job"});
  job = {
    id: crypto.randomUUID(),
    type,
    logs: ["Job accepted","Planning","Rendering…"],
    output:null,
    startedAt: Date.now()
  };
  audit(`JOB_START ${job.id} ${type}`);

  // simulate generation (replace with FFmpeg/tool later)
  setTimeout(()=>{
    const out = path.join(OUTPUT, "demo.mp4");
    fs.writeFileSync(out, "DEMO"); // placeholder
    job.logs.push("Output ready");
    job.output = "/output/demo.mp4";
    audit(`JOB_DONE ${job.id}`);
  }, 3000);

  res.json({ ok:true, jobId: job.id });
});

/* ===== STATIC ===== */
app.use("/output", express.static(OUTPUT, { immutable:true, maxAge:"1h" }));
app.use(express.static(PUBLIC));

/* ===== FALLBACK ===== */
app.use((err,req,res,next)=>{
  audit(`ERROR ${err.message}`);
  res.status(400).json({error:"Request blocked"});
});

/* ===== START ===== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log("🔒 AIX Hardened Server on", PORT));
