const { makePlan } = require("../brain/planner");
const { execute } = require("../brain/executor");
const { critic } = require("../brain/critic");
const { remember } = require("../brain/memoryGraph");
const config = require("../config/config");

async function runAGI(task) {
  let thoughts = [];

  for (let i = 0; i < config.MAX_THOUGHTS; i++) {

    const plan = await makePlan(task);
    const result = await execute("echo " + plan);
    const review = await critic(result);

    thoughts.push({ step: i, plan, result, review });

    await remember({ task, plan, result, review });

    if (review.toLowerCase().includes("success")) break;
  }

  return thoughts;
}

module.exports = { runAGI };
