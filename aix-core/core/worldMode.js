const axios = require("axios");

async function worldAwareness() {
  console.log("🌍 WORLD MODE ACTIVE");

  try {
    const news = await axios.get("https://api.publicapis.org/entries");

    console.log("World Knowledge Loaded:", news.data.count);

  } catch (e) {
    console.log("World Mode Error:", e.message);
  }
}

module.exports = { worldAwareness };
