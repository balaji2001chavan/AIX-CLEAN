const { makePlan } = require("../planner/planner");
const { think } = require("../brain/llm");

async function runAgent(task) {
  let plan = await makePlan(task);

  let result = await think(`
Execute this plan:

${plan}
`);

  return {
    plan,
    result
  };
}

module.exports = { runAgent };
