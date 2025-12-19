import fs from "fs";
import path from "path";

const memoryFile = path.join(process.cwd(), "backend", "memory", "memory.json");

function loadMemory() {
  if (!fs.existsSync(memoryFile)) return [];
  return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

function saveMemory(memory) {
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2), "utf8");
}

export function addToMemory(role, content) {
  const memory = loadMemory();
  memory.push({ role, content, time: new Date().toISOString() });

  // Limit memory size (last 50)
  if (memory.length > 50) {
    memory.splice(0, memory.length - 50);
  }

  saveMemory(memory);
}

export function getMemory() {
  return loadMemory();
}
