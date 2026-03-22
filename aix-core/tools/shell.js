const { exec } = require("child_process");
const { REPO_PATH } = require("../config/config");

function run(cmd) {
  return new Promise(resolve => {
    exec(cmd, { cwd: REPO_PATH }, (e, out, err) => {
      if (e) return resolve(err);
      resolve(out);
    });
  });
}

module.exports = { run };
