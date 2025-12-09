import { MODE } from "./mode.js";
import { processCommand } from "../engine/task-planner.js";
import { deployToRender } from "./deploy-engine.js";

export async function execute(command) {

  // Controlled Mode: Ask before action
  if (MODE === "CONTROLLED") {
    return {
      mode: MODE,
      message: "Approval required",
      nextStep: "confirm to run: run(command)"
    };
  }

  // AGI Mode: Execute immediately
  if (MODE === "AGI") {
    const result = processCommand(command);
    return {
      mode: MODE,
      executed: true,
      result
    };
  }

  // Hybrid Mode: Minor tasks auto, major tasks approval
  if (MODE === "HYBRID") {
    const majorKeywords = ["deploy", "delete", "system", "critical"];
    const isMajor = majorKeywords.some(k => command.includes(k));

    if (isMajor) {
      return {
        mode: MODE,
        requireApproval: true,
        command
      };
    }

    const result = processCommand(command);
    return {
      mode: MODE,
      executed: true,
      result
    };
  }
}
