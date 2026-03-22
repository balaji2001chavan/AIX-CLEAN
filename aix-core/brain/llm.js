const axios = require("axios");
const { MODEL, OLLAMA_URL } = require("../config/config");

async function think(prompt) {
  const res = await axios.post(OLLAMA_URL, {
    model: MODEL,
    prompt,
    stream: false
  });

  return res.data.response;
}

module.exports = { think };
