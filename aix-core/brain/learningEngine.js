const fs = require("fs-extra");
const path = require("path");

const MEMORY_PATH = path.join(__dirname, "../memory/experience.json");

async function loadMemory() {
    if (!(await fs.pathExists(MEMORY_PATH))) {
        await fs.writeJson(MEMORY_PATH, []);
    }
    return await fs.readJson(MEMORY_PATH);
}

async function saveExperience(exp) {
    let memory = await loadMemory();
    memory.push(exp);
    await fs.writeJson(MEMORY_PATH, memory, { spaces: 2 });
}

async function learnFromExecution(plan, results) {
    let experience = {
        time: new Date(),
        plan,
        results,
        success: results.every(r => r.success)
    };

    await saveExperience(experience);

    return {
        learned: true,
        successRate: experience.success
    };
}

async function analyzePast() {
    let memory = await loadMemory();

    let success = memory.filter(m => m.success).length;
    let total = memory.length;

    return {
        totalRuns: total,
        successRuns: success,
        successRate: total ? success / total : 0
    };
}

module.exports = {
    learnFromExecution,
    analyzePast
};
