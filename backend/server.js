import express from "express";
import cors from "cors";

const app = express();

// ✅ CORS FIX - Render frontend allow
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ==========================
//   MAIN AIX API
// ==========================
app.post("/api/aix", async (req, res) => {
  const msg = req.body.message || "";

  if (!msg) {
    return res.json({
      reply: "काहीतरी लिहा बॉस 😄 मी तयार आहे!"
    });
  }

  // Smart reply (temporary – working)
  let aiReply = "";

  if (msg.includes("hi") || msg.includes("hello") || msg.includes("हाय")) {
    aiReply = "हाय बॉस, मी AIX. तुमचा digital साथी. सांगा काय काम आहे?";
  } 
  else if (msg.includes("काम") || msg.includes("help")) {
    aiReply = "मी तयार आहे बॉस — काम सांगा, लगेच action सुरू करतो.";
  }
  else {
    aiReply = `बॉस, मी तुमचा मेसेज समजलो: "${msg}" — पुढचं काय करू?`;
  }

  return res.json({
    reply: aiReply
  });
});

// ==========================
//   ROOT TEST
// ==========================
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// ==========================
//   START SERVER
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Boss AIX Backend running on", PORT));
