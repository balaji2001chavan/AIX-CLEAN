const { runAGI } = require("../core/agiLoop");
const { worldAwareness } = require("../core/worldMode");

async function master() {
  console.log("🧠 MASTER AGENT STARTED");

  await worldAwareness();

  const thoughts = await runAGI("Build global intelligence system");

  console.log("AGI Thoughts:", thoughts);
}

module.exports = { master };
