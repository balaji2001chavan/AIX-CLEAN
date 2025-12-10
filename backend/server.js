import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS – STATIC SITE SUPPORT
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ Preflight (this fixes your error)
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

app.use(express.json());

// ✅ health check (very important)
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE ✅" });
});

// ✅ frontend is calling THIS
app.post("/api/boss/command", (req, res) => {
  const text = (req.body.text || "").toLowerCase();

  if (text.includes("चालू") || text.includes("alive")) {
    return res.json({ reply: "हो Boss ✅ मी चालू आहे." });
  }

  if (text === "yes") {
    return res.json({ reply: "✅ Approval मिळालं. काम सुरू." });
  }

  if (text === "no") {
    return res.json({ reply: "❌ Cancel केलं Boss." });
  }

  return res.json({
    reply: "मी तयार आहे Boss. पुढचं काम सांगा."
  });
});

app.listen(PORT, () => {
  console.log("✅ Boss AIX Backend LIVE on", PORT);
});
