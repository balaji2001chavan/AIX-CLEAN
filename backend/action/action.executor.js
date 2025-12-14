import { contentAction } from "./content.action.js";
import { analysisAction } from "./analysis.action.js";
import { helpAction } from "./help.action.js";

export function executeAction(command) {
  const goal = command.goal?.toLowerCase() || "";

  if (!goal) {
    return {
      executed: false,
      message: "Goal दिलेला नाही"
    };
  }

  if (goal.includes("content") || goal.includes("पोस्ट") || goal.includes("व्हिडिओ")) {
    return contentAction(command);
  }

  if (goal.includes("analysis") || goal.includes("खरेदी") || goal.includes("निर्णय")) {
    return analysisAction(command);
  }

  return helpAction(command);
}
