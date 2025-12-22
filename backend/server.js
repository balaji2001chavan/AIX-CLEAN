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

/* ======================
   HELPERS
====================== */
function topicFrom(msg){
  const m = msg.toLowerCase();
  if (m.includes("reel") || m.includes("video")) return "instagram-reel";
  if (m.includes("business") || m.includes("plan")) return "business";
  if (m.includes("error") || m.includes("problem")) return "diagnose";
  return "general";
}

function saveChat(topic, role, text){
  const dir = path.join(MEMORY, topic);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const file = path.join(dir, "chat.json");
  const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  data.push({ role, text, time: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ======================
   STATUS
====================== */
app.get("/api/status", (req,res)=>{
  res.json({
    mode: "AUTO-HYBRID",
    aiAvailable: true,
    pendingAction: "NO",
    lastError: null,
    uptimeSeconds: process.uptime()
  });
});

/* ======================
   AIX CORE
====================== */
app.post("/api/aix",(req,res)=>{
  const msg = req.body?.message || "";
  const topic = topicFrom(msg);

  saveChat(topic,"user",msg);

  let reply = "";

  if (!msg.trim()) {
    reply = "बॉस, काहीतरी सांगा 🙂";
  }
  else if (topic === "instagram-reel") {
    reply =
`🎬 बॉस, Instagram Reel विषय ओळखला.
मी हा विषय वेगळा सेव्ह करतो.

पुढे हवं:
1️⃣ Product
2️⃣ Audience
3️⃣ Goal (sales / branding)

सांगा, मग मी exact script + steps देतो.`;
  }
  else if (topic === "diagnose") {
    reply =
`🛠️ Diagnose mode ON बॉस.

मी हे करू शकतो:
• Problem explain
• Root cause
• Exact fix
• Ready code

Error message / screenshot पाठवा.`;
  }
  else if (topic === "business") {
    reply =
`💼 Business planning चालू आहे बॉस.

मी देऊ शकतो:
• Validation
• Strategy
• Revenue ideas
• Risks

Business type सांगा.`;
  }
  else {
    reply =
`नमस्कार बॉस 👋  
मी AIX आहे — smart, practical assistant.

तुम्ही बोलू शकता:
• Business
• Content
• System problems
• Planning

काय करू बॉस?`;
  }

  saveChat(topic,"aix",reply);

  res.json({
    success:true,
    topic,
    reply
  });
});

/* ======================
   TOPICS LIST
====================== */
app.get("/api/topics",(req,res)=>{
  res.json({ topics: fs.readdirSync(MEMORY) });
});

app.get("/",(_,res)=>res.send("AIX FINAL CORE LIVE"));

app.listen(PORT,()=>console.log("✅ AIX FINAL running",PORT));
