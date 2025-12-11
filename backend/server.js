import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// CORS FIX (Render → Render communication allowed)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// SIMPLE HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// AIX MAIN ENDPOINT (Frontend याचला हिट करते)
app.post("/api/aix", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ error: "NO_MESSAGE" });
  }

  // TEMP REPLY (फिलहाल ChatGPT-स्टाइल स्मूथ)
  let reply = `Boss AIX: मला तुझं म्हणणं कळलं — "${message}". आता पुढचा आदेश दे Boss.`;

  res.json({
    ok: true,
    reply: reply
  });
});

// PORT CONFIG
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Boss AIX Backend running on port", PORT);
});
