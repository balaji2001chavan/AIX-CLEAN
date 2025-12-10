import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ VERY IMPORTANT: CORS (with preflight support)
app.use(cors({
  origin: "*",                // frontend allow
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ Preflight handler (THIS FIXES YOUR ERROR)
app.options("*", cors());

// ✅ JSON body
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ status: "Boss AIX Backend LIVE ✅" });
});

// ✅ MAIN API
app.post("/api/boss/command", (req, res) => {
  const text = (req.body.text || "").toLowerCase();

  if (text === "yes") {
    return res.json({
      reply: "✅ Approved. Boss AIX काम सुरू करतो."
    });
  }

  if (text === "no") {
    return res.json({
      reply: "❌ Cancelled. काहीही बदल केले नाहीत."
    });
  }

  if (
    text.includes("add") ||
    text.includes("जोड") ||
    text.includes("create")
  ) {
    return res.json({
      reply: "मी हा बदल करू शकतो.",
      plan: [
        "गरज समजून घेणे",
        "योग्य logic / API ठरवणे",
        "Backend update करणे",
        "Frontend update करणे",
        "Testing आणि Deploy"
      ],
      askApproval: true
    });
  }

  return res.json({
    reply: "मी तयार आहे Boss. पुढचं काम सांगा."
  });
});

app.listen(PORT, () => {
  console.log("✅ Boss AIX Backend LIVE on port", PORT);
});
