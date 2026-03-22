const { runAGI } = require("./agiLoop");

async function autoThink() {
  console.log("🧠 AUTO THINK MODE START");

  while (true) {
    try {
      let task = "improve system intelligence";
      let thoughts = await runAGI(task);

      console.log("AGI Thoughts:", thoughts);

      await new Promise(r => setTimeout(r, 5000));

    } catch (e) {
      console.log("AGI Error:", e.message);
    }
  }
}

module.exports = { autoThink };
