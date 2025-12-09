// backend/ai/memory.js
// ESM module (node >= 14+) — exports: saveMemory, readMemory, remember, recall

import { promises as fsp } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const MEM_FILE = path.join(DATA_DIR, "memories.json");

// In-memory cache for speed + fallback
let MEM = {};

// Ensure data directory exists and load file if present
async function _init() {
  try {
    await fsp.mkdir(DATA_DIR, { recursive: true });
    const txt = await fsp.readFile(MEM_FILE, "utf8").catch(() => null);
    if (txt) {
      MEM = JSON.parse(txt);
    } else {
      MEM = {};
    }
  } catch (e) {
    console.warn("[memory] init warning:", e?.message || e);
    MEM = {};
  }
}
_init(); // kick off (async)

// Save full user memory object (overwrites user's memory array with provided array)
export async function saveMemory(userId, memoryArray) {
  MEM[userId] = Array.isArray(memoryArray) ? memoryArray : [];
  try {
    await fsp.mkdir(DATA_DIR, { recursive: true });
    await fsp.writeFile(MEM_FILE, JSON.stringify(MEM, null, 2), "utf8");
  } catch (e) {
    console.error("[memory] saveMemory error:", e?.message || e);
  }
  return MEM[userId];
}

// Read user's memory (returns array)
export async function readMemory(userId) {
  // If not loaded yet, initialize (best-effort)
  if (!MEM) await _init();
  return MEM[userId] ? [...MEM[userId]] : [];
}

// Lightweight synchronous helper to push a single record and persist (non-blocking)
export function remember(userId, prompt, reply) {
  try {
    MEM[userId] = MEM[userId] || [];
    const record = {
      id: Date.now().toString(36) + "-" + Math.floor(Math.random() * 10000),
      prompt: String(prompt || ""),
      reply: String(reply || ""),
      ts: new Date().toISOString(),
    };
    MEM[userId].push(record);

    // Persist asynchronously (don't await)
    fsp.mkdir(DATA_DIR, { recursive: true })
      .then(() => fsp.writeFile(MEM_FILE, JSON.stringify(MEM, null, 2), "utf8"))
      .catch((err) => console.warn("[memory] persist warning:", err?.message || err));

    return record;
  } catch (e) {
    console.error("[memory] remember error:", e?.message || e);
    return null;
  }
}

// Synchronous recall (returns array copy)
export function recall(userId) {
  return (MEM[userId] || []).slice();
}