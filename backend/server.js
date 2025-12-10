import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ status: "Boss AIX Backend LIVE ✅" });
});

// ✅ Main Boss AIX API
app.post("/api/boss/command", (req, res) => {
  const text = (req.body.text || "").toLowerCase();

  // Approval commands
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

  // Action intent
  if (
    text.includes("add") ||
    text.includes("जोड") ||
    text.includes("create")
  ) {
    return res.json({
      reply: "मी हा बदल करू शकतो.",
      plan: [
        "आवश्यक गरज समजून घेणे",
        "योग्य API / logic ठरवणे",
        "Backend logic तयार करणे",
        "Frontend अपडेट करणे",
        "Testing आणि Deploy"
      ],
      askApproval: true
    });
  }

  // Normal chat
  return res.json({
    reply: "मी तयार आहे Boss. तुम्ही काय करायचं ते सांगा."
  });
});

app.listen(PORT, () => {
  console.log("✅ Boss AIX Backend LIVE on port", PORT);
});
