import express from "express";
import cors from "cors";
import OpenAI from "openai";

/* ================= BASIC APP ================= */
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ================= OPENAI BRAIN ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are AIX.

You speak like a smart, practical, emotionally-aware Indian assistant.
You behave like a trusted human advisor, not a chatbot.
You NEVER give fixed confirms or robotic replies.
You adapt to the user's language (Marathi / Hindi / English).
You ask clarifying questions before taking any real-world action.
You explain consequences before acting.
You only suggest legal and realistic actions.

If the user asks for real work:
- First explain what you can do
- Ask for confirmation ("करू का?")
- Wait for explicit approval before action
`;

/* ================= SIMPLE MEMORY (SESSION) ================= */
let memory = {
  lastIntent: null,
  pendingAction: null
};

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.send("AIX CORE LIVE");
});

/* ================= REAL ACTION HANDLERS ================= */

/* Demo: Product Search (real work placeholder) */
async function searchProducts({ budget = 300, category = "general" }) {
  return [
    {
      title: "Men Casual T-Shirt",
      price: 289,
      url: "https://example.com/men-tshirt"
    },
    {
      title: "Wireless Earbuds",
      price: 299,
      url: "https://example.com/earbuds"
    }
  ];
}

/* Demo: Repo Reader (real work placeholder) */
function readRepo() {
  return {
    folders: ["controllers", "services", "routes"],
    files: ["server.js", "package.json"]
  };
}

/* ================= MAIN AIX API ================= */
app.post("/api/aix", async (req, res) => {
  try {
    const userMessage = req.body.message?.trim();
    if (!userMessage) {
      return res.json({ reply: "काय सांगायचं आहे बॉस?" });
    }

    /* ================= HANDLE APPROVAL ================= */
    if (
      memory.pendingAction &&
      ["हो", "yes", "ok", "कर", "करा"].includes(userMessage.toLowerCase())
    ) {
      const action = memory.pendingAction;
      memory.pendingAction = null;

      if (action.type === "PRODUCT_SEARCH") {
        const items = await searchProducts(action.payload);
        return res.json({
          reply:
            "ठीक आहे बॉस. खाली उपलब्ध प्रॉडक्ट्स दिले आहेत. थेट लिंकवर क्लिक करून पाहू शकता.",
          result: items
        });
      }

      if (action.type === "REPO_READ") {
        const repo = readRepo();
        return res.json({
          reply:
            "मी प्रोजेक्ट वाचला आहे बॉस. खाली स्ट्रक्चर आणि महत्वाच्या गोष्टी दिल्या आहेत.",
          result: repo
        });
      }
    }

    /* ================= OPENAI CHAT ================= */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ]
    });

    const aiReply = completion.choices[0].message.content;

    /* ================= INTENT DETECTION (LIGHT) ================= */
    const lower = userMessage.toLowerCase();

    if (
      lower.includes("₹") ||
      lower.includes("कपडे") ||
      lower.includes("product")
    ) {
      memory.pendingAction = {
        type: "PRODUCT_SEARCH",
        payload: { budget: 300 }
      };
    }

    if (
      lower.includes("repo") ||
      lower.includes("प्रोजेक्ट") ||
      lower.includes("code वाच")
    ) {
      memory.pendingAction = {
        type: "REPO_READ"
      };
    }

    return res.json({ reply: aiReply });
  } catch (err) {
    console.error("AIX ERROR:", err);
    return res.status(500).json({
      reply:
        "थोडी तांत्रिक अडचण आली बॉस. थोड्या वेळाने पुन्हा प्रयत्न करूया."
    });
  }
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("AIX Backend LIVE on port", PORT);
});
