import express from "express";
import cors from "cors";

import { parseCommand } from "./aix-core/core/command-engine/parseCommand.js";
import { getState, updateState } from "./aix-core/core/state-engine/stateManager.js";
import { createPlan } from "./aix-core/core/planner/planner.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/aix", (req, res) => {
  const { message } = req.body;

  const command = parseCommand(message);
  const state = getState();
  const plan = createPlan(command, state);

  updateState(`Planned: ${command.goal}`);

  res.json({
    command,
    plan,
    state
  });
});

app.get("/", (req, res) => {
  res.send("AIX CORE IS LIVE");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AIX CORE running on port", PORT);
});
