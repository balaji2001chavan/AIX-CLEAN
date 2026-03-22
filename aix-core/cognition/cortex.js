const world = require("./worldModel");
const planner = require("../brain/planner");
const executor = require("../brain/executor");
const critic = require("../brain/critic");
const memory = require("../brain/memoryGraph");

async function think(task) {
    const state = await world.observe();

    const strategy = await planner.makePlan(task, state);

    const simulation = await world.simulate(strategy);

    const result = await executor.execute(simulation.bestAction);

    const review = await critic.review(result);

    await memory.remember({ task, state, strategy, result, review });

    return review;
}

module.exports = { think };
