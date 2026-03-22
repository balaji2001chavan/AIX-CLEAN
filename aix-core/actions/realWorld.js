const { exec } = require("child_process");

async function takeAction(command) {
    return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                resolve({ success: false, error: stderr });
            } else {
                resolve({ success: true, output: stdout });
            }
        });
    });
}

async function realWorldExecutor(plan) {
    let results = [];

    for (let step of plan.steps) {
        const res = await takeAction(step.command);
        results.push(res);
    }

    return results;
}

module.exports = { realWorldExecutor };
