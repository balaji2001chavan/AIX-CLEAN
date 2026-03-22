const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

const TASK_LOG = path.join(__dirname, "../memory/tasks.json");

async function loadTasks() {
    if (!(await fs.pathExists(TASK_LOG))) {
        await fs.writeJson(TASK_LOG, []);
    }
    return await fs.readJson(TASK_LOG);
}

async function saveTask(task) {
    let data = await loadTasks();
    data.push(task);
    await fs.writeJson(TASK_LOG, data, { spaces: 2 });
}

function runCommand(cmd) {
    return new Promise((resolve) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) return resolve(stderr);
            resolve(stdout);
        });
    });
}

async function executeTask(action) {
    let result;

    if (action === "fix_system") {
        result = await runCommand("npm audit fix");
    }

    else if (action === "optimize") {
        result = await runCommand("pm2 restart all");
    }

    else if (action === "add_feature") {
        result = "AI planning new feature...";
    }

    else if (action === "self_learn") {
        result = "AI learning new patterns...";
    }

    let task = {
        time: new Date(),
        action,
        result
    };

    await saveTask(task);

    return task;
}

module.exports = {
    executeTask
};
