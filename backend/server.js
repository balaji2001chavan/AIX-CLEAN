import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MEMORY_DIR = path.join(process.cwd(), "aix-memory");

if (!fs.existsSync(MEMORY_DIR)) {
  fs.mkdirSync(MEMORY_DIR);
}

/* ===============================
   UTILS
================================ */
function detectTopic(message) {
  const m = message.toLowerCase();
  if (m.includes("reel") || m.includes("instagram") || m.includes("video"))
    return "instagram-reel";
  if (m.includes("business") || m.includes("plan"))
    return "business-planning";
  if (m.includes("system") || m.includes("repair"))
    return "system-repair";
  return "general-chat";
}

function saveChat(topic, role, text) {
  const dir = path.join(MEMORY_DIR, topic);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const file = path.join(dir, "chat.json");
  let chats = [];
  if (fs.existsSync(file)) {
    chats = JSON.parse(fs.readFileSync(file));
  }

  chats.push({
    role,
    text,
    time: new Date().toISOString()
  });

  fs.writeFileSync(file, JSON.stringify(chats, null, 2));
}

function readChat(topic) {
  const file = path.join(MEMORY_DIR, topic, "chat.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

/* ===============================
   STATUS
================================ */
app.get("/api/status", (req, res) => {
  res.json({
    server: "ONLINE",
    memory: "ACTIVE",
    time: new Date().toISOString()
  });
});

/* ===============================
   AIX CORE WITH MEMORY
================================ */
app.post("/api/aix", (req, res) => {
  const message = req.body?.message || "";
  const topic = detectTopic(message);

  // save user chat
  saveChat(topic, "user", message);

  const history = readChat(topic);
  let reply = "";

  if (message.toLowerCase().includes("हो")) {
    reply =
      `✅ बॉस, "${topic}" या विषयावर काम सुरू करतो.\n` +
      `मी या विषयाचा पूर्ण context लक्षात ठेवतो.\n` +
      `पुढचं काय करायचं ते सांगा.`;
  }
  else if (topic === "instagram-reel") {
    reply =
      "🎬 बॉस, आपण Instagram Reel विषयावर आहोत.\n" +
      "आत्तापर्यंत चर्चा:\n" +
      `👉 ${history.length} messages\n\n` +
      "Audience आणि प्रॉडक्ट सांगा, मग मी demo दाखवतो.";
  }
  else if (topic === "business-planning") {
    reply =
      "💼 बॉस, Business Planning topic ओळखला आहे.\n" +
      "मी या विषयातील सगळी चर्चा वेगळी सेव्ह करतो.\n" +
      "Business type सांगा.";
  }
  else if (topic === "system-repair") {
    reply =
      "🛠️ बॉस, System Repair mode चालू आहे.\n" +
      "मी जुने issues लक्षात ठेवतो.\n" +
      "Diagnosis सुरू करू का?";
  }
  else {
    reply =
      "नमस्कार बॉस 👋\n" +
      "नवीन विषय ओळखला आहे.\n" +
      "तुम्ही नवीन विषयावर बोलत आहात.\n" +
      "थोडक्यात काय हवं ते सांगा.";
  }

  // save aix reply
  saveChat(topic, "aix", reply);

  res.json({
    success: true,
    topic,
    reply,
    messagesInThisTopic: history.length + 1
  });
});

/* ===============================
   GET TOPICS
================================ */
app.get("/api/topics", (req, res) => {
  const topics = fs.readdirSync(MEMORY_DIR);
  res.json({ topics });
});

/* ===============================
   ROOT
================================ */
app.get("/", (req, res) => {
  res.send("AIX MEMORY SYSTEM LIVE");
});

app.listen(PORT, () => {
  console.log("🧠 AIX with Memory running on port", PORT);
});
