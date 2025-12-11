import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",       // Allow ALL (Frontend fixed)
  methods: "*",
  allowedHeaders: "*"
}));

// ---- HEALTH CHECK ----
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// ---- MAIN AIX ROUTE ----
app.post("/api/aix", async (req, res) => {
  const message = req.body?.message || "";

  // SIMPLE NORMAL SMART REPLY
  if (!message.trim()) {
    return res.json({ reply: "काय मदत करू?" });
  }

  // Example Replies
  res.json({
    reply: `Boss AIX: मी तुझं बोलणं समजलो → "${message}".  
मी आत्ता LIVE आहे आणि तुझ्यासोबत काम करण्यास तयार आहे.`
  });
});

// ---- START ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Boss AIX Backend running"));
