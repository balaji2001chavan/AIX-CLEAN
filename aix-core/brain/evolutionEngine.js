const fs = require("fs-extra");
const path = require("path");

const PROJECT_ROOT = path.join(__dirname, "../../");
const EVOLUTION_LOG = path.join(__dirname, "../memory/evolution.json");

async function loadEvolution() {
    if (!(await fs.pathExists(EVOLUTION_LOG))) {
        await fs.writeJson(EVOLUTION_LOG, []);
    }
    return await fs.readJson(EVOLUTION_LOG);
}

async function saveEvolution(data) {
    let log = await loadEvolution();
    log.push(data);
    await fs.writeJson(EVOLUTION_LOG, log, { spaces: 2 });
}

async function scanProject() {
    let files = await fs.readdir(PROJECT_ROOT);
    return files;
}

async function proposeImprovements() {
    let files = await scanProject();

    let suggestions = [];

    if (!files.includes("tests")) {
        suggestions.push("Create testing framework");
    }

    if (!files.includes("docs")) {
        suggestions.push("Add documentation system");
    }

    if (!files.includes("monitor")) {
        suggestions.push("Add monitoring engine");
    }

    return suggestions;
}

async function evolveSystem() {
    let improvements = await proposeImprovements();

    let evolution = {
        time: new Date(),
        improvements
    };

    await saveEvolution(evolution);

    return evolution;
}

module.exports = {
    evolveSystem
};
