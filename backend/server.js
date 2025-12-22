import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ===============================
   AIX MEMORY (simple but effective)
================================ */
let memory = {
  lastIntent: null,
  lastProject: null,
  awaitingApproval: false,
};

/* ===============================
   INTENT DETECTION (SMART)
================================ */
function detectIntent(message) {
  const m = message.toLowerCase();

  if (m.includes("reel") || m.includes("video")) return "VIDEO_CREATE";
  if (m.includes("image") || m.includes("poster")) return "IMAGE_CREATE";
  if (m.includes("map") || m.includes("location")) return "MAP_PREVIEW";
  if (m.includes("business") || m.includes("idea")) return "BUSINESS_EXPLAIN";

  return "GENERAL_CHAT";
}

/* ===============================
   THINK PHASE
================================ */
function think(message) {
  const intent = detectIntent(message);

  return {
    intent,
    needsClarification:
      intent !== "GENERAL_CHAT" &&
      !memory.lastProject &&
      !message.includes(":"),
  };
}

/* ===============================
   DECIDE PHASE
================================ */
function decide(thought) {
  if (thought.needsClarification) {
    return {
      mode: "CLARIFY",
      text:
        "बॉस, सुरू करण्याआधी थोडी माहिती हवी आहे.\n" +
        "👉 प्रॉडक्ट/विषय काय आहे?\n" +
        "👉 Audience कोण आहे?",
    };
  }

  return {
    mode: "DEMO",
    text: "बॉस, हा output असा दिसेल 👇",
  };
}

/* ===============================
   EXECUTE PHASE (REAL FILE PROOF)
================================ */
function execute(intent) {
  const outputDir = path.join(process.cwd(), "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const timestamp = new Date().toISOString();
  const proofFile = path.join(outputDir, "proof.json");

  const proof = {
    intent,
    message: "Execution completed successfully",
    timestamp,
  };

  fs.writeFileSync(proofFile, JSON.stringify(proof, null, 2));

  return {
    file: "/output/proof.json",
    preview:
      intent === "VIDEO_CREATE"
        ? "🎬 Sample Reel Frame"
        : intent === "IMAGE_CREATE"
        ? "🖼 Sample Image Preview"
        : "📄 Demo Preview",
  };
}

/* ===============================
   MAIN AIX ENDPOINT
================================ */
app.post("/api/aix", (req, res) => {
  const message = req.body.message || "";

  const thought = think(message);
  memory.lastIntent = thought.intent;

  if (thought.needsClarification) {
    return res.json({
      mode: "CLARIFY",
      reply:
        "Good evening बॉस 👋\n" +
        "मी ऐकतोय. योग्य output देण्यासाठी थोडी माहिती हवी आहे.",
      questions: [
        "प्रॉडक्ट / विषय काय आहे?",
        "Audience कोण आहे?",
      ],
      status: "WAITING_FOR_INPUT",
    });
  }

  // Demo stage
  if (!memory.awaitingApproval) {
    memory.awaitingApproval = true;
    return res.json({
      mode: "DEMO",
      reply:
        "बॉस, हा output असा दिसेल.\n" +
        "जर ठीक वाटत असेल तर 'हो' असा रिप्लाय द्या.",
      visual: {
        type:
          memory.lastIntent === "VIDEO_CREATE"
            ? "video"
            : memory.lastIntent === "IMAGE_CREATE"
            ? "image"
            : "text",
        preview: "Demo Preview Area",
      },
      nextAction: "AWAIT_APPROVAL",
    });
  }

  // Execution stage
  if (message.toLowerCase().includes("हो")) {
    memory.awaitingApproval = false;

    const result = execute(memory.lastIntent);

    return res.json({
      mode: "EXECUTED",
      reply:
        "काम पूर्ण झालं आहे बॉस ✅\n" +
        "खाली proof आणि preview दिलं आहे.",
      result,
      status: "COMPLETED",
    });
  }

  return res.json({
    mode: "CHAT",
    reply:
      "बॉस, मी ऐकतोय.\n" +
      "माहिती, सल्ला की रियल काम — काय हवं आहे?",
  });
});

/* ===============================
   STATIC OUTPUT
================================ */
app.use("/output", express.static(path.join(process.cwd(), "output")));

app.get("/", (req, res) => {
  res.send("AIX SMART CORE IS LIVE");
});

app.listen(PORT, () => {
  console.log("AIX Smart Server running on port", PORT);
});
