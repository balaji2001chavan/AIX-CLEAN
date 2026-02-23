import { systemStatus, repairSystem } from "./tools.js";

export async function runAgent(message) {

  message = message.toLowerCase();

  if (message.includes("status") || message.includes("health")) {
    return await systemStatus();
  }

  if (message.includes("repair") || message.includes("fix")) {
    return await repairSystem();
  }

  return null;
}
