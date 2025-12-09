import fs from "fs";
import { exec } from "child_process";

const LOG_FILE = "./config/system_log.json";

// --- Utility: log ---
function log(entry) {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOG_FILE));
  }

  logs.push({
    time: new Date().toISOString(),
    ...entry
  });

  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

// --- Check server health ---
async function checkBackend() {
  try {
    const res = await fetch("http://localhost:5000");
    if (!res.ok) throw new Error("Backend bad response");

    log({ type: "HEALTH", status: "OK", service: "backend" });
  } catch (e) {
    log({ type: "ERROR", service: "backend", error: e.message });
    autoRepair("backend");
  }
}

// --- Ollama check ---
async function checkOllama() {
  try {
    await fetch("http://localhost:11434");
    log({ type: "HEALTH", status: "OK", service: "ollama" });
  } catch (e) {
    log({ type: "ERROR", service: "ollama", error: e.message });
    autoRepair("ollama");
  }
}

// --- AUTO REPAIR ---
function autoRepair(service) {
  log({ type: "REPAIR_START", service });

  if (service === "backend") {
    exec("node server.js"); // restart
    log({ type: "REPAIR_ACTION", service, action: "backend restarted" });
  }

  if (service === "ollama") {
    exec("ollama serve");
    log({ type: "REPAIR_ACTION", service, action: "ollama restarted" });
  }
}

// --- MAIN LOOP ---
setInterval(() => {
  checkBackend();
  checkOllama();
}, 10000); // every 10 seconds