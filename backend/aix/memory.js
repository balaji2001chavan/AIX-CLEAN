// aix/memory.js
import fs from "fs";

const MEMORY_FILE = "C:/Users/HP/BOSS_AIX_OS/backend/logs/memory.json";

// 🔹 Load memory
function loadMemory() {
  if (!fs.existsSync(MEMORY_FILE)) return [];
  return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
}

// 🔹 Save memory
function saveMemory(data) {
  fs.mkdirSync("C:/Users/HP/BOSS_AIX_OS/backend/logs", { recursive: true });
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
}

// ✅ Store new experience
export function storeExperience(error, fix) {
  const memory = loadMemory();

  memory.push({
    time: new Date().toISOString(),
    error: error.message,
    fix
  });

  saveMemory(memory);
}

// ✅ Find past fix
export function findKnownFix(errorMessage) {
  const memory = loadMemory();

  return memory.find(m => errorMessage.includes(m.error));
}