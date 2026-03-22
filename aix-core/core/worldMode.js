const axios = require("axios");

async function worldAwareness() {
  console.log("🌍 WORLD MODE ACTIVE");

  try {
    const res = await axios.get("https://api.coindesk.com/v1/bpi/currentprice.json");

    console.log("World Data:", res.data.bpi.USD.rate);
  } catch (e) {
    console.log("World fetch failed");
  }
}

module.exports = { worldAwareness };
