const { think } = require("../brain/llm");

async function makePlan(task) {
  const plan = await think(`
You are AGI planner.
Break task into steps.

TASK:
${task}
`);

  return plan;
}

module.exports = { makePlan };
