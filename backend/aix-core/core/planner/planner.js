export function createPlan(command, state) {
  const plan = [];

  if (command.goal) {
    plan.push(`Understand goal: ${command.goal}`);
  }

  if (command.context) {
    plan.push(`Check context: ${command.context}`);
  }

  plan.push("Decide next safe action");
  plan.push("Prepare output");

  return plan;
}
