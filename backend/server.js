// ------------------------------
// BOSS AIX – SUPER SMART BACKEND
// ------------------------------

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 💠 HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    ok: true,
    msg: "🔥 Boss AIX Backend LIVE",
    time: new Date().toISOString(),
  });
});

// 💠 UNIVERSAL AI REQUEST FUNCTION
async function askAI(prompt) {
  try {
    const r = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:latest",
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await r.json();
    return data.response || "AI ने काही उत्तर दिले नाही";
  } catch (err) {
    return "AI ENGINE DOWN आहे ❌ " + err.message;
  }
}

// ----------------------------------------------
// 💠 MAIN ENDPOINT → CHAT / PLAN / ACTION / REPLY
// ----------------------------------------------
app.post("/api/boss/command", async (req, res) => {
  const { message, approve } = req.body;

  if (!message && !approve)
    return res.json({ error: "EMPTY MESSAGE" });

  let finalPrompt = "";

  if (!approve) {
    // AI ला विचारण्यासाठी PROMPT
    finalPrompt = `
    You are BOSS AIX.
    Reply like a human conversational AI.
    Understand user intention.
    If user asks a task → generate PLAN.
    Output JSON ONLY:

    {
      "type": "PLAN",
      "ask": "तुला याची खात्री आहे का?",
      "steps": ["Step1 ...", "Step2 ..."]
    }

    If reply is normal → use:
    {
      "type": "CHAT",
      "reply": "तुझं उत्तर"
    }

    USER: ${message}
    `;
  } else {
    // User ने PLAN approve केले
    finalPrompt = `
    You are BOSS AIX executing APPROVED PLAN.
    Complete real action and output JSON:

    {
      "type":"ACTION",
      "result":"काम पूर्ण झाले",
      "details":"काय केले ते"
    }
    `;
  }

  const ai = await askAI(finalPrompt);

  try {
    const clean = JSON.parse(ai);
    res.json(clean);
  } catch {
    res.json({
      type: "CHAT",
      reply: "मी तयार आहे. सांगा, पुढे काय करू?",
    });
  }
});

// --------------------------------
// 💠 START SERVER
// --------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🔥 BOSS AIX SUPER BACKEND LIVE → " + PORT);
});
