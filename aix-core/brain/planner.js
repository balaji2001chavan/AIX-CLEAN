const axios = require("axios");
const config = require("../config/config");

async function makePlan(task) {
  const res = await axios.post(config.OLLAMA_URL, {
    model: config.MODEL,
    prompt: `
You are AGI planner.
Create logical step-by-step plan:

TASK:
${task}
`,
    stream: false
  });

  return res.data.response;
}

module.exports = { makePlan };
