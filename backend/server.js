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

app.use("/aix-output", express.static(OUTPUT));

/* ================= SESSION MEMORY ================= */

const SESSIONS = {};

function getSession(userId = "default") {
  if (!SESSIONS[userId]) {
    SESSIONS[userId] = {
      activeTopic: null,
      stage: null,
      history: []
    };
  }
  return SESSIONS[userId];
}

/* ================= HELPERS ================= */

function detectTopic(text) {
  const t = text.toLowerCase();
  if (t.includes("reel") || t.includes("instagram")) return "instagram-reel";
  if (t.includes("business")) return "business";
  if (t.includes("github")) return "github";
  return "general";
}

function topicDir(topic) {
  const dir = path.join(MEMORY, topic);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  return dir;
}

function saveChat(topic, role, text) {
  const file = path.join(topicDir(topic), "chat.json");
  const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  data.push({ role, text, time: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function createProof(topic, content) {
  const name = `${topic}-${Date.now()}.txt`;
  const out = path.join(OUTPUT, name);
  fs.writeFileSync(out, content);

  fs.writeFileSync(
    path.join(topicDir(topic), "proof.json"),
    JSON.stringify({
      topic,
      output: `/aix-output/${name}`,
      time: new Date().toISOString()
    }, null, 2)
  );

  return `/aix-output/${name}`;
}

/* ================= API ================= */

app.get("/api/status", (_, res) => {
  res.json({ status: "ONLINE" });
});

app.post("/api/aix", (req, res) => {
  const message = (req.body.message || "").trim();
  const session = getSession("default");

  let reply = "";
  let preview = null;

  // store history
  session.history.push({ role: "user", message });

  /* -------- YES / NO HANDLING -------- */
  if (message === "हो" || message === "yes") {
    if (session.stage === "confirm_execution") {
      preview = createProof(
        session.activeTopic,
        `AIX executed real task for topic: ${session.activeTopic}`
      );

      reply =
        "✅ काम execute झालं आहे बॉस.\n" +
        "खाली output पहा, download किंवा share करा.";

      session.stage = "done";
    } else {
      reply = "🤔 बॉस, कशाला 'हो' म्हणताय? आधी विषय सांगा.";
    }
  }

  /* -------- NEW TOPIC -------- */
  else {
    const topic = detectTopic(message);
    session.activeTopic = topic;
    session.stage = "confirm_execution";

    reply =
      `📌 विषय ओळखला: ${topic}\n\n` +
      "मी या विषयावर रियल output तयार करू शकतो.\n" +
      "Demo / execution करू का? (हो / नाही)";
  }

  saveChat(session.activeTopic || "general", "user", message);
  saveChat(session.activeTopic || "general", "aix", reply);

  res.json({
    reply,
    topic: session.activeTopic,
    preview
  });
});

/* ================= ROOT ================= */

app.get("/", (_, res) => {
  res.send("AIX CORE FINAL – LIVE");
});

app.listen(PORT, () => {
  console.log("AIX running on", PORT);
});
