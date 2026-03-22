const axios = require("axios");

const MODEL = "llama3";
const OLLAMA = "http://localhost:11434/api/generate";

async function askAI(role, task) {
    const prompt = `
You are ${role} AI.

TASK:
${task}

Give best intelligent output.
`;

    const ai = await axios.post(OLLAMA, {
        model: MODEL,
        prompt,
        stream: false
    });

    return ai.data.response;
}

/* ================= AGENTS ================= */

async function planner(task) {
    return askAI("Planner", task);
}

async function coder(task) {
    return askAI("Senior Software Engineer", task);
}

async function fixer(task) {
    return askAI("Debug Expert", task);
}

async function analyst(task) {
    return askAI("Business Analyst", task);
}

async function webAgent(task) {
    return askAI("Internet Research AI", task);
}

/* ================= MASTER BRAIN ================= */

async function runMultiAgent(task) {

    const plan = await planner(task);
    const code = await coder(plan);
    const fix = await fixer(code);
    const analysis = await analyst(task);

    return {
        plan,
        code,
        fix,
        analysis
    };
}

module.exports = {
    runMultiAgent
};
