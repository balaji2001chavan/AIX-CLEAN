const axios = require("axios");
const config = require("../config/config");

async function critic(result) {
  const res = await axios.post(config.OLLAMA_URL, {
    model: config.MODEL,
    prompt: `
Analyze result and say improve or success:

${result}
`,
    stream: false
  });

  return res.data.response;
}

module.exports = { critic };
