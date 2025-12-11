import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// ❤️ CORS – FIX FOR RENDER FRONTEND
app.use(cors({
  origin: "*",            // allow all
  methods: "GET,POST",    // what methods allowed
  allowedHeaders: "Content-Type"
}));

app.use(bodyParser.json());

// TEST ROOT
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// MAIN API used by frontend
app.post("/api/aix", (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "मला काय सांगायचे ते बोला बॉस ❤️" });
    }

    // TEMP dummy smart reply
    return res.json({
      reply: `बॉस, मी ऐकत आहे: "${message}". AIX पूर्ण स्मार्ट मोडमध्ये आहे 🔥`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AIX ERROR: Backend crash झाला" });
  }
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Boss AIX Backend running on PORT", PORT);
});
