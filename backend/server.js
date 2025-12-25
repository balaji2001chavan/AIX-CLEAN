import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.json({ status: "AIX LIVE", time: new Date() });
});

/* ===============================
   LIVE NEWS (FREE PUBLIC SOURCE)
   Using Hacker News API (NO KEY)
================================ */
app.get("/api/live/news", async (req, res) => {
  try {
    const response = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );

    const ids = await response.json();
    const topIds = ids.slice(0, 5);

    const stories = await Promise.all(
      topIds.map(async (id) => {
        const r = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        return r.json();
      })
    );

    res.json({
      success: true,
      source: "HackerNews (Live)",
      data: stories.map((s) => ({
        title: s.title,
        url: s.url,
        by: s.by,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Live news fetch failed",
      error: error.message,
    });
  }
});

/* ===============================
   WEATHER (FREE, NO API KEY)
================================ */
app.get("/api/live/weather", async (req, res) => {
  try {
    const city = req.query.city || "Pune";
    const url = `https://wttr.in/${city}?format=j1`;

    const response = await fetch(url);
    const data = await response.json();

    res.json({
      success: true,
      city,
      temperature: data.current_condition[0].temp_C,
      weather: data.current_condition[0].weatherDesc[0].value,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Weather fetch failed",
      error: error.message,
    });
  }
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ AIX Backend running on port", PORT);
});
