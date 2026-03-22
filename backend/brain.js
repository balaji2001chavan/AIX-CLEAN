const fs = require("fs-extra");

let memory = [];

function addMemory(text) {
  memory.push(text);
}

function recallMemory(query) {
  return memory
    .filter(m => m.includes(query))
    .slice(-5)
    .join("\n");
}

module.exports = { addMemory, recallMemory };
