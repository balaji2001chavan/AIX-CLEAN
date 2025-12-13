import fs from "fs";
import path from "path";

const statePath = path.join(process.cwd(), "backend/aix-core/core/state-engine/state.json");

export function getState() {
  const raw = fs.readFileSync(statePath);
  return JSON.parse(raw);
}

export function updateState(action) {
  const state = getState();
  state.lastAction = action;
  state.history.push({
    action,
    time: new Date().toISOString()
  });

  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}
