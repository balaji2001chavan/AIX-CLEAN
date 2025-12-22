import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ===============================
   AIX CORE LOGIC
================================ */
function aixReply(message) {
  const m = message.toLowerCase();

  // Smart intent understanding
  if (m.includes("reel") || m.includes("video")) {
    return {
      reply:
        "🎬 बॉस, Instagram Reel साठी हा smart flow आहे:\n" +
        "1️⃣ Audience ठरवा\n" +
        "2️⃣ Hook (पहिले 3 सेकंद)\n" +
        "3️⃣ Product benefit\n" +
        "4️⃣ Call to Action\n\n" +
        "तुम्ही तयार असाल तर मी demo दाखवू शकतो.",
      type: "VIDEO_IDEA"
    };
  }

  if (m.includes("business")) {
    return {
      reply:
        "💼 बॉस, Business smart बनवण्यासाठी 3 गोष्टी महत्वाच्या:\n" +
        "✔ Market demand\n" +
        "✔ Automation\n" +
        "✔ Trust & execution\n\n" +
        "तुमचा business कोणत्या क्षेत्रात आहे?",
      type: "BUSINESS"
    };
  }

  if (m.includes("हो")) {
    return {
      reply:
        "✅ समजलं बॉस.\n" +
        "आता पुढचा step execute करू शकतो.\n" +
        "काय output हवा आहे ते सांगा (Video / Image / Plan).",
      type: "CONFIRM"
    };
  }

  // Default smart human reply
  return {
    reply:
      "नमस्कार बॉस 👋\n" +
      "मी AIX आहे — smart business intelligence.\n" +
      "तुम्ही:\n" +
      "• Business idea\n" +
      "• Marketing\n" +
      "• Video / Image\n" +
      "• Planning\n\n" +
      "याबद्दल काहीही विचारू शकता.",
    type: "GENERAL"
  };
}

/* ===============================
   API
================================ */
app.post("/api/aix", (req, res) => {
  try {
    const message = req.body?.message || "";

    const result = aixReply(message);

    return res.status(200).json({
      success: true,
      reply: result.reply,
      type: result.type,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      reply: "⚠️ काहीतरी चुकलं बॉस, पण मी अजून जिवंत आहे.",
      error: err.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("AIX v3 SMART CORE LIVE");
});

app.listen(PORT, () => {
  console.log("✅ AIX v3 running on port", PORT);
});
