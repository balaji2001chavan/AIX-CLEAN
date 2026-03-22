const { exec } = require("child_process");

function execute(command) {
  return new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return resolve(stderr);
      resolve(stdout);
    });
  });
}

module.exports = { execute };
