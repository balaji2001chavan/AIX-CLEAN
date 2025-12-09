import { askAI } from "./ollama.js";

export async function generatePlan(userCommand) {
  const prompt = `
You are Boss AIX.
You ONLY generate a PLAN.
You NEVER execute actions.

FORMAT:

PLAN:
Goal:
Category:
Steps:
Tools:
Complexity:
Risks:
Approval Required: YES / NO

User Command:
${userCommand}
  `;

  return await askAI(prompt);
}