import fs from "fs";
import path from "path";

const statePath = path.join(process.cwd(), "aix-core/core/state-engine/state.json");

export function getState() {
  if (!fs.existsSync(statePath)) {
    fs.writeFileSync(statePath, JSON.stringify({
      project: "AIX",
      lastAction: "",
      history: []
    }, null, 2));
  }
  return JSON.parse(fs.readFileSync(statePath, "utf-8"));
}

export function updateState(action) {
  const s = getState();
  s.lastAction = action;
  s.history.push({ action, time: new Date().toISOString() });
  fs.writeFileSync(statePath, JSON.stringify(s, null, 2));
}
