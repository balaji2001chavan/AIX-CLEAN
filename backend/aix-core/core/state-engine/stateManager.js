import fs from "fs";
import path from "path";

const statePath = path.join(
  process.cwd(),
  "aix-core/core/state-engine/state.json"
);

export function getState() {
  if (!fs.existsSync(statePath)) {
    fs.writeFileSync(
      statePath,
      JSON.stringify(
        {
          project: "AIX",
          features: [],
          lastAction: "",
          history: []
        },
        null,
        2
      )
    );
  }

  const raw = fs.readFileSync(statePath, "utf-8");
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
