import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ===============================
   SYSTEM STATUS
================================ */
app.get("/api/status", (req, res) => {
  res.json({
    server: "ONLINE",
    time: new Date().toISOString(),
    message: "AIX backend is healthy"
  });
});

/* ===============================
   AUTO DIAGNOSE
================================ */
app.get("/api/diagnose", (req, res) => {
  res.json({
    status: "OK",
    issues: [],
    suggestion: "System stable आहे. कोणतीही तातडीची दुरुस्ती गरजेची नाही."
  });
});

/* ===============================
   AIX SMART CORE
================================ */
app.post("/api/aix", (req, res) => {
  try {
    const msg = (req.body?.message || "").toLowerCase();
    let reply = "";

    if (!msg) {
      reply = "बॉस, काहीतरी लिहा. मी ऐकतोय.";
    }
    else if (msg.includes("reel") || msg.includes("video")) {
      reply =
        "🎬 बॉस, Instagram Reel साठी smart प्लॅन:\n" +
        "1️⃣ Hook (पहिले 3 सेकंद)\n" +
        "2️⃣ Product फायदा\n" +
        "3️⃣ Call-to-Action\n\n" +
        "Demo दाखवू का?";
    }
    else if (msg.includes("system") || msg.includes("problem")) {
      reply =
        "🛠️ बॉस, system तपासलं आहे.\n" +
        "सध्या backend stable आहे.\n" +
        "जर frontend issue असेल तर:\n" +
        "✔ Backend URL तपासा\n" +
        "✔ Network error बघा\n\n" +
        "मी diagnose मोड चालू करू का?";
    }
    else {
      reply =
        "नमस्कार बॉस 👋\n" +
        "मी AIX आहे — smart business intelligence.\n" +
        "तुम्ही marketing, business, planning, content बद्दल काहीही विचारू शकता.";
    }

    res.json({
      success: true,
      reply,
      time: new Date().toISOString()
    });
  } catch (e) {
    res.json({
      success: false,
      reply: "⚠️ काहीतरी चुकलं बॉस. पण system अजून चालू आहे.",
      error: e.message
    });
  }
});

/* ===============================
   ROOT
================================ */
app.get("/", (req, res) => {
  res.send("AIX FINAL v1 BACKEND LIVE");
});

app.listen(PORT, () => {
  console.log("✅ AIX FINAL v1 running on port", PORT);
});
