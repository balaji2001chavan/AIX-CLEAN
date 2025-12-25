import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "aix-output");
const MEMORY = path.join(ROOT, "aix-memory");

if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT);
if (!fs.existsSync(MEMORY)) fs.mkdirSync(MEMORY);

/* ---------- SESSION MEMORY ---------- */
const SESSIONS = {};

function getSession(id = "default") {
  if (!SESSIONS[id]) {
    SESSIONS[id] = {
      topic: null,
      step: null
    };
  }
  return SESSIONS[id];
}

/* ---------- HELPERS ---------- */
function detectTopic(msg) {
  const t = msg.toLowerCase();
  if (t.includes("reel") || t.includes("video")) return "instagram-reel";
  if (t.includes("business")) return "business";
  if (t.includes("image")) return "image";
  return "general";
}

function saveOutput(topic, text) {
  const file = `${topic}-${Date.now()}.txt`;
  fs.writeFileSync(path.join(OUTPUT, file), text);
  return `/aix-output/${file}`;
}

app.use("/aix-output", express.static(OUTPUT));

/* ---------- API ---------- */
app.post("/api/aix", (req, res) => {
  const msg = (req.body.message || "").trim();
  const session = getSession();

  let reply = "";
  let preview = null;

  // YES handling
  if (msg === "हो" || msg === "yes") {
    if (session.step === "confirm") {
      preview = saveOutput(
        session.topic,
        `AIX executed real work for topic: ${session.topic}`
      );
      reply =
        "✅ काम पूर्ण झालं आहे.\n" +
        "खाली output आहे. Download / Share करू शकता.";
      session.step = null;
    } else {
      reply = "🤔 कशासाठी 'हो' म्हणताय? आधी विषय सांगा.";
    }
  }

  // NEW MESSAGE
  else {
    const topic = detectTopic(msg);
    session.topic = topic;
    session.step = "confirm";

    reply =
      "मी समजून घेतलं 👍\n" +
      `विषय: ${topic}\n\n` +
      "या विषयावर मी real output तयार करू शकतो.\n" +
      "करू का? (हो / नाही)";
  }

  res.json({ reply, preview });
});

app.listen(PORT, () => {
  console.log("AIX FINAL backend running");
});
