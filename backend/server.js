import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// ⭐ Allow all frontend origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// Root Check
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// ⭐ MAIN SMART AIX ROUTE
app.post("/api/aix", async (req, res) => {
  try {
    const msg = req.body.message;

    if (!msg) {
      return res.status(400).json({ error: "MESSAGE_REQUIRED" });
    }

    // --- SUPER AI REPLY (Meta-style) ---
    const smartReply = await generateSmartReply(msg);

    return res.json({
      boss: true,
      reply: smartReply,
      heard: msg
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ⭐ Temporary local intelligent brain
async function generateSmartReply(text) {
  return `
मी Boss AIX आहे — तुमचा स्मार्ट साथीदार 🤖

तुम्ही म्हणालेलं मी समजलो:
➡️ "${text}"

मी आता काय करू?
• माहिती देऊ?
• प्रॉडक्ट दाखवू?
• प्रॉपर्टी शोधू?
• व्हिडिओ बनवू?
• Feature add करू?
• System सुधारू?

मला सांगा — मी तयार आहे 🔥
`;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🔥 Boss AIX Backend running on", PORT);
});
