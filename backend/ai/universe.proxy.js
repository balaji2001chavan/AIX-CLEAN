import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  next();
});

const FEEDS = {
  earth:
    "https://api.nasa.gov/EPIC/archive/natural/2019/05/30/png/epic_1b_20190530011359.png?api_key=DEMO_KEY",
  sun: "https://soho.nascom.nasa.gov/data/realtime/eit_304/1024/latest.jpg",
  stars: "https://raw.githubusercontent.com/matiasvlevi/stars-galaxy/main/stars_8k.jpg",
  galaxy: "https://raw.githubusercontent.com/matiasvlevi/stars-galaxy/main/milkyway_8k.jpg",
};

router.get("/:type", async (req, res) => {
  const type = req.params.type;
  const url = FEEDS[type];
  if (!url) return res.status(404).send("Invalid universe asset");
  try {
    const r = await fetch(url);
    const buffer = await r.arrayBuffer();
    res.setHeader("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.log("Proxy fetch error:", err.message || err);
    res.status(500).send("Proxy fetch failed");
  }
});


export default router;