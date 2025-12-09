import { MODE } from "./mode.js";
import { processCommand } from "../engine/task-planner.js";
import { selfRepair } from "./self-repair.js";
import { evolveSystem } from "../ai/evolution-engine.js";

export async function execute(command) {
  const result = {
    input: command,
    mode: MODE,
    executed: false,
    steps: []
  };

  // 🔹 Step 1: Log command as evolution data
  evolveSystem();

  // 🔹 CONTROLLED (Manual approval needed)
  if (MODE === "CONTROLLED") {
    result.steps.push("Requesting approval before execution.");
    return result;
  }

  // 🔹 AGI Mode: Execute everything instantly
  if (MODE === "AGI") {
    const action = processCommand(command);
    result.executed = true;
    result.steps.push("Executed in AGI mode without approval.");
    return action;
  }

  // 🔹 HYBRID Mode: Auto minor tasks, major asks approval
  if (MODE === "HYBRID") {
    const riskWords = ["deploy", "delete", "overwrite", "system", "core", "kernel"];
    const critical = riskWords.some(word => command.toLowerCase().includes(word));

    if (critical) {
      result.steps.push("Critical task → manual approval required");
      return result;
    }

    const action = processCommand(command);
    result.executed = true;
    result.steps.push("Executed minor task automatically in HYBRID mode.");
    return action;
  }

  // 🔹 CLOUD Mode (Future Extension)
  if (MODE === "CLOUD") {
    result.steps.push("Cloud mode routing (deployment modules next)");
    return result;
  }

  return result;
}
