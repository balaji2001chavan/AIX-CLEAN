// aix/health.js
import fs from "fs";

const LOG_DIR = "C:/Users/HP/BOSS_AIX_OS/backend/logs";
const ERROR_LOG = `${LOG_DIR}/errors.log`;
const MEMORY_FILE = `${LOG_DIR}/memory.json`;

export function getHealth() {
  let lastError = null;
  let memoryCount = 0;

  if (fs.existsSync(ERROR_LOG)) {
    const txt = fs.readFileSync(ERROR_LOG, "utf8").trim();
    lastError = txt ? txt.split("\n\n").slice(-1)[0] : null;
  }

  if (fs.existsSync(MEMORY_FILE)) {
    try {
      const mem = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
      memoryCount = Array.isArray(mem) ? mem.length : 0;
    } catch {}
  }

  return {
    status: "HEALTHY",
    time: new Date().toISOString(),
    memoryCount,
    lastError
  };
}