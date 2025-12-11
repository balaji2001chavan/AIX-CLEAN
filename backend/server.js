import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// 🔥 CORS FIX — Render frontend allow
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// 🔥 TEST ROUTE — Backend चालू आहे का?
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// 🔥 AIX MAIN API
app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body.message || "No message";

    return res.json({
      boss: true,
      reply: `AIX बोलतोय… तू विचारले: ${message}`,
      ok: true
    });
  } catch (err) {
    return res.status(500).json({ error: "Server Error", details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Boss AIX Backend running on ${PORT}`));
