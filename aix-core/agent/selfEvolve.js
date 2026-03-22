const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const MODEL = "llama3";
const PROJECT_PATH = "/home/ec2-user/AIX-CLEAN";

async function scanProject() {
    const files = await fs.readdir(PROJECT_PATH);
    return files.join(", ");
}

async function generateEvolutionPlan() {
    const projectFiles = await scanProject();

    const ai = await axios.post("http://localhost:11434/api/generate", {
        model: MODEL,
        prompt: `
You are AGI Architect.
Analyze project files:

${projectFiles}

Create evolution plan:
1. Improve architecture
2. Add intelligence
3. Fix issues
4. Optimize performance
`,
        stream: false
    });

    return ai.data.response;
}

async function evolve() {
    const plan = await generateEvolutionPlan();

    return {
        status: "EVOLUTION READY",
        plan
    };
}

module.exports = {
    evolve
};
