import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ------------ FIX 1: Render PORT Support -------------
const PORT = process.env.PORT || 5000;

// ------------ FIX 2: CORS 100% UNBLOCK ---------------
app.use(cors({ origin: "*" }));

// ------------ FIX 3: JSON Body Parser ----------------
app.use(express.json({ limit: "50mb" }));

// ------------ FIX 4: ROOT CHECK ----------------------
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE", time: new Date() });
});

// ------------ FIX 5: MAIN /api/aix ENDPOINT ----------
app.post("/api/aix", async (req, res) => {
  try {
    const user = req.body.message || "Hello";

    const result = {
      boss: true,
      heard: user,
      reply: `मी ऐकत आहे, ${user}`,
      model: "llama3.2",
      status: "OK"
    };

    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message
    });
  }
});

// ------------ FIX 6: 404 HANDLER ----------------------
app.use((req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    path: req.originalUrl
  });
});

// ------------ START SERVER ----------------------------
app.listen(PORT, () =>
  console.log(`🔥 Boss AIX Backend running on ${PORT}`)
);
