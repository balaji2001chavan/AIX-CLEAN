const fs = require("fs-extra");
const config = require("../config/config");

async function loadMemory() {
  if (!(await fs.pathExists(config.MEMORY_FILE))) return [];
  return fs.readJSON(config.MEMORY_FILE);
}

async function saveMemory(data) {
  await fs.writeJSON(config.MEMORY_FILE, data, { spaces: 2 });
}

async function remember(item) {
  let mem = await loadMemory();
  mem.push(item);
  await saveMemory(mem);
}

module.exports = { loadMemory, saveMemory, remember };
