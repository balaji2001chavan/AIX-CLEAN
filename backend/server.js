import express from "express";
import cors from "cors";

const app = express();

// ⭐ Render → Frontend domain allow
const FRONTEND_URL = "https://boss-aix-frontend.onrender.com";

// ⭐ CORS FIX – MOST IMPORTANT
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ⭐ Body parser
app.use(express.json());

// ------------------------------
//  TEST ROUTE
// ------------------------------
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// ------------------------------
//  AIX MAIN ROUTE
// ------------------------------
app.post("/api/aix", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ error: "NO_MESSAGE" });
    }

    // TEMPORARY AI REPLY until real model connected
    const reply = `Boss AIX (Smart Mode): "${message}" मी समजलो.`;

    res.json({ reply });
  } catch (err) {
    res.json({ error: "SERVER_ERROR", info: err.toString() });
  }
});

// ------------------------------
//  START SERVER
// ------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Boss AIX Backend running on PORT ${PORT}`)
);
