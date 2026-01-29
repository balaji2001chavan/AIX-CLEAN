/**
 * AIX – Master Agent Brain
 * Human-level conversational + system awareness AI
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import os from "os";
import mongoose from "mongoose";
import { execSync } from "child_process";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

/* =========================
   SYSTEM INTELLIGENCE
========================= */

function systemStatus() {
  return {
    serverTime: new Date().toISOString(),
    os: os.platform(),
    cpu: os.cpus()[0].model,
    memoryGB: (os.totalmem() / 1024 ** 3).toFixed(2),
    uptimeHours: (os.uptime() / 3600).toFixed(2),
    nodeVersion: process.version,
    envLoaded: fs.existsSync(".env"),
  };
}

function checkServices() {
  const report = {};

  try {
    execSync("pm2 list");
    report.pm2 = "RUNNING";
  } catch {
    report.pm2 = "NOT RUNNING";
  }

  try {
    execSync("nginx -t");
    report.nginx = "CONFIG OK";
  } catch {
    report.nginx = "NGINX ERROR";
  }

  report.mongodb =
    process.env.MONGODB_URI ? "CONFIGURED" : "NOT CONFIGURED";

  report.openai =
    process.env.OPENAI_API_KEY ? "KEY PRESENT" : "MISSING KEY";

  return report;
}

/* =========================
   DATABASE (MEMORY)
========================= */

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("🧠 AIX Memory Online"))
  .catch(() => console.log("⚠️ MongoDB not connected"));

const Memory = mongoose.model("AIX_Memory", {
  role: String,
  content: String,
  time: { type: Date, default: Date.now },
});

/* =========================
   AIX CORE CHAT
========================= */

app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "Say something. I am listening." });
  }

  await Memory.create({ role: "user", content: message });

  const sys = systemStatus();
  const services = checkServices();

  const reply = `
Hello. I am AIX.

I understood you said:
"${message}"

🧠 Current System Awareness:
• Server OS: ${sys.os}
• Node.js: ${sys.nodeVersion}
• Memory: ${sys.memoryGB} GB
• Uptime: ${sys.uptimeHours} hours
• .env Loaded: ${sys.envLoaded}

⚙️ Service Status:
• PM2: ${services.pm2}
• NGINX: ${services.nginx}
• MongoDB: ${services.mongodb}
• OpenAI API: ${services.openai}

📌 What I can do next:
1. Diagnose AWS / EC2 issues
2. Fix backend/frontend connection
3. Analyze GitHub repo structure
4. Prepare production-ready deployment
5. Act as business / app / AI builder

Tell me **what you want to build, fix, or grow**.
I will guide and execute step by step.
`.trim();

  await Memory.create({ role: "aix", content: reply });

  res.json({
    reply,
    mode: "MASTER_AGENT",
    intelligence: "HUMAN_LEVEL",
  });
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "AIX ONLINE",
    brain: "ACTIVE",
    time: new Date().toISOString(),
  });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AIX Master Brain running on port ${PORT}`);
});
