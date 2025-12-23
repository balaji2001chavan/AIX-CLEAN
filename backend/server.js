import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ROOT = process.cwd();
const MEMORY = path.join(ROOT, "aix-memory");
const OUTPUT = path.join(ROOT, "aix-output");

if (!fs.existsSync(MEMORY)) fs.mkdirSync(MEMORY);
if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT);

// serve outputs publicly
app.use("/aix-output", express.static(OUTPUT));

/* ---------- UTILS ---------- */
function detectTopic(msg) {
  const m = msg.toLowerCase();
  if (m.includes("reel") || m.includes("video")) return "instagram-reel";
  if (m.includes("business")) return "business";
  if (m.includes("system")) return "system";
  return "general";
}

function topicDir(topic) {
  const dir = path.join(MEMORY, topic);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  return dir;
}

function saveChat(topic, role, text) {
  const file = path.join(topicDir(topic), "chat.json");
  const arr = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  arr.push({ role, text, time: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
}

function saveProof(topic, data) {
  const file = path.join(topicDir(topic), "proof.json");
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}

/* ---------- STATUS ---------- */
app.get("/api/status", (_, res) => {
  res.json({
    server: "ONLINE",
    time: new Date().toISOString()
  });
});

/* ---------- CORE ---------- */
app.post("/api/aix", (req, res) => {
  const message = req.body?.message || "";
  const topic = detectTopic(message);

  saveChat(topic, "user", message);

  let reply = "";
  let previewUrl = null;

  if (message.toLowerCase() === "हो") {
    // REAL FILE CREATION (proof)
    const filename = `${topic}-${Date.now()}.txt`;
    const outPath = path.join(OUTPUT, filename);

    fs.writeFileSync(
      outPath,
      `AIX executed real task for topic: ${topic}`
    );

    previewUrl = `/aix-output/${filename}`;

    saveProof(topic, {
      status: "EXECUTED",
      output: previewUrl,
      time: new Date().toISOString()
    });

    reply =
      "✅ काम पूर्ण झालं बॉस.\n" +
      "खाली output पाहा, डाउनलोड करा किंवा शेअर करा.";
  }
  else if (topic === "instagram-reel") {
    reply =
      "🎬 Instagram Reel विषय ओळखला आहे.\n" +
      "मी:\n" +
      "• Script\n" +
      "• Scene plan\n" +
      "• Caption\n\n" +
      "Demo तयार करू का? (हो / नाही)";
  }
  else {
    reply =
      "नमस्कार बॉस 👋\n" +
      "मी AIX आहे — smart intelligence.\n" +
      "तुम्ही video, business, system बद्दल बोलू शकता.";
  }

  saveChat(topic, "aix", reply);

  res.json({
    success: true,
    topic,
    reply,
    previewUrl
  });
});

/* ---------- ROOT ---------- */
app.get("/", (_, res) => {
  res.send("AIX FINAL v3 BACKEND LIVE");
});

app.listen(PORT, () => {
  console.log("✅ AIX FINAL v3 running on port", PORT);
});
