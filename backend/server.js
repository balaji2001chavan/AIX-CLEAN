/* ================= GLOBAL FIX ================= */
global.File = class File {};

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const simpleGit = require("simple-git");
const { exec } = require("child_process");
const cheerio = require("cheerio");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= CONFIG ================= */
const MODEL = "llama3";
const REPO_PATH = "/home/ec2-user/AIX-CLEAN";
const MEMORY_FILE = path.join(REPO_PATH, "memory.json");

const git = simpleGit(REPO_PATH);

let autonomousMode = false;

/* ================= SAFE EXECUTOR ================= */
function runCommand(cmd) {
  return new Promise((resolve) => {
    if (
      !cmd.startsWith("npm") &&
      !cmd.startsWith("pm2") &&
      !cmd.startsWith("ls") &&
      !cmd.startsWith("git")
    ) {
      return resolve("Command blocked for safety");
    }

    exec(cmd, { cwd: REPO_PATH }, (err, stdout, stderr) => {
      if (err) return resolve(stderr);
      resolve(stdout);
    });
  });
}

/* ================= SEARCH ================= */
async function webSearch(query) {
  try {
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let results = [];
    $("a.result__a").each((i, el) => {
      results.push($(el).text());
    });

    return results.slice(0, 5).join("\n");
  } catch {
    return "Internet search failed";
  }
}

/* ================= MEMORY ================= */
async function loadMemory() {
  if (!(await fs.pathExists(MEMORY_FILE))) return [];
  return JSON.parse(await fs.readFile(MEMORY_FILE));
}

async function saveMemory(data) {
  await fs.writeFile(MEMORY_FILE, JSON.stringify(data, null, 2));
}

/* ================= PLAN ================= */
async function makePlan(task) {
  const ai = await axios.post("http://localhost:11434/api/generate", {
    model: MODEL,
    prompt: `Create execution plan:\n${task}`,
    stream: false
  });
  return ai.data.response;
}

/* ================= BUILD ================= */
async function autoBuild(task) {
  const ai = await axios.post("http://localhost:11434/api/generate", {
    model: MODEL,
    prompt: `Write production ready solution:\n${task}`,
    stream: false
  });
  return ai.data.response;
}

/* ================= AGENT LOOP ================= */
async function runAgent(task) {
  let history = [];
  let final = "";

  for (let i = 0; i < 3; i++) {
    const plan = await makePlan(task);
    const action = await autoBuild(plan);

    history.push({ step: i + 1, plan, action });
    final = action;
  }

  return { final, history };
}

/* ================= EVOLVE ================= */
async function evolveProject() {
  const files = await fs.readdir(REPO_PATH);

  const ai = await axios.post("http://localhost:11434/api/generate", {
    model: MODEL,
    prompt: `Analyze project files:\n${files.join(", ")}`,
    stream: false
  });

  return ai.data.response;
}

/* ================= AUTONOMOUS THINK ================= */
async function autonomousThink() {
  if (!autonomousMode) return;

  try {
    const memory = await loadMemory();

    const ai = await axios.post("http://localhost:11434/api/generate", {
      model: MODEL,
      prompt: `
You are autonomous AGI.

Think next improvement.
Memory:
${JSON.stringify(memory.slice(-10))}
`,
      stream: false
    });

    const thought = ai.data.response;
    console.log("🧠 AIX THINK:", thought);

    memory.push({ aix_think: thought });
    await saveMemory(memory);

  } catch (e) {}

  setTimeout(autonomousThink, 20000);
}

/* ================= HEALTH ================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "🔥 AIX MASTER AGENT RUNNING" });
});

/* ================= CHAT ================= */
app.post("/api/chat", async (req, res) => {
  try {
    const msg = req.body?.message || "";

    if (!msg) {
      return res.json({ reply: "Empty message" });
    }

    let memory = await loadMemory();
    memory.push({ user: msg });

    if (msg.startsWith("plan ")) {
      return res.json({ reply: await makePlan(msg.replace("plan ", "")) });
    }

    if (msg.startsWith("search ")) {
      return res.json({ reply: await webSearch(msg.replace("search ", "")) });
    }

    if (msg === "ls") {
      const files = await fs.readdir(REPO_PATH);
      return res.json({ reply: files.join("\n") });
    }

    const context = memory.slice(-5).map(m => JSON.stringify(m)).join("\n");

    const ai = await axios.post("http://localhost:11434/api/generate", {
      model: MODEL,
      prompt: context + "\nUser: " + msg,
      stream: false
    });

    memory.push({ aix: ai.data.response });
    await saveMemory(memory);

    res.json({ reply: ai.data.response });

  } catch (e) {
    console.log(e);
    res.json({ reply: "AIX CRASH FIX MODE" });
  }
});


app.listen(8888, () => console.log("🔥 AIX MASTER RUNNING"));
