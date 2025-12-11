import express from "express";
import cors from "cors";

const app = express();

// FIX 1: Allow all origins for frontend
app.use(cors({
  origin: "*",
  methods: "GET,POST,OPTIONS",
  allowedHeaders: "Content-Type"
}));

app.use(express.json());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// MAIN AIX ROUTE
app.post("/api/aix", async (req, res) => {
  try {
    const userMsg = req.body.message || "";

    if (!userMsg.trim()) {
      return res.json({ reply: "काहीतरी लिहा बॉस." });
    }

    // Temporary reply (Later will connect to model)
    res.json({
      reply: `Boss AIX बोलतोय → "${userMsg}" समजले बॉस. मी अजून शिकतोय.`
    });

  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR", details: err.message });
  }
});

// SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Boss AIX Backend Running on port", PORT);
});
