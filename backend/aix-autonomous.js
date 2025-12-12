// backend/aix-autonomous.js
import { brainResponse } from "./ai/brain.js";
import { repairSystem } from "./aix-self-repair.js";

export async function autonomousAIX(input) {
  try {
    const brain = await brainResponse(input);

    // If error → call repair engine
    if (brain?.error) {
      return await repairSystem(brain.error);
    }

    // If task detected → auto execute
    if (brain?.task) {
      return {
        mode: "AUTO",
        action: `Executing task: ${brain.task}`,
        result: "AIX is performing this task automatically…"
      };
    }

    return { reply: brain.reply };

  } catch (err) {
    return await repairSystem(err.toString());
  }
}
