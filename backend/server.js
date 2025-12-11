import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

// ⭐ CORS FIXED
app.use(cors({
  origin: "*",
  methods: "GET,POST,OPTIONS",
  allowedHeaders: "Content-Type"
}));

app.use(express.json());

// ⭐ HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// ⭐ MAIN AIX API
app.post("/api/aix", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ error: "NO_MESSAGE" });
    }

    // Render वर Ollama नाही म्हणून mock reply
    res.json({
      reply: `AIX: मी ऐकलं → "${message}".  
      मी Render backend वर चालू आहे.  
      हे message मी AI सारखे process करतो.`,
      model: "render-mode"
    });

  } catch (err) {
    res.json({ error: "SERVER_ERROR", details: err.message });
  }
});

// ⭐ START SERVER
app.listen(PORT, () => {
  console.log("Boss AIX Backend running on port", PORT);
});
