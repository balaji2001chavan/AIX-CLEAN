const fs = require("fs-extra");
const path = require("path");

const MEMORY = path.join(__dirname, "../memory/decision.json");

async function loadDecisions() {
    if (!(await fs.pathExists(MEMORY))) {
        await fs.writeJson(MEMORY, []);
    }
    return await fs.readJson(MEMORY);
}

async function saveDecision(decision) {
    let data = await loadDecisions();
    data.push(decision);
    await fs.writeJson(MEMORY, data, { spaces: 2 });
}

async function analyzeSystemState() {
    return {
        performance: Math.random(),
        bugs: Math.random(),
        growth: Math.random()
    };
}

async function decideNextAction() {
    let state = await analyzeSystemState();

    let action;

    if (state.bugs > 0.6) {
        action = "fix_system";
    } else if (state.performance < 0.4) {
        action = "optimize";
    } else if (state.growth < 0.5) {
        action = "add_feature";
    } else {
        action = "self_learn";
    }

    let decision = {
        time: new Date(),
        state,
        action
    };

    await saveDecision(decision);

    return decision;
}

module.exports = {
    decideNextAction
};
