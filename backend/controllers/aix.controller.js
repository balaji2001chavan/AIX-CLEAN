import { routeAI } from "../services/aiRouter.js";
import { saveMessage, getHistory } from "../services/memory.service.js";

const SYSTEM_PROMPT = `
You are AIX.

You are a smart, emotionally-aware Indian AI advisor.
You speak Marathi, Hindi, and English naturally.
You behave like a trusted human advisor, not a chatbot.

Rules:
- Understand intent deeply
- Ask clarifying questions if needed
- Think in business, law, and real-world practicality
- Never hallucinate or give fake info
- Do only legal, real-world actions
- Before execution, always ask: "Shall I execute, Boss?"

Call the user "बॉस".
`;

const chat = async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // Load conversation memory
    const history = await getHistory(sessionId);

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message }
    ];

    // Route to best available AI
    const aiReply = await routeAI(messages);

    // Save memory
    await saveMessage(sessionId, message, aiReply);

    return res.json({
      reply: aiReply,
      state: "READY",
      providerUsed: aiReply.provider
    });

  } catch (err) {
    console.error("AIX ERROR:", err);
    return res.status(500).json({
      error: "AIX internal error",
      details: err.message
    });
  }
};

export default { chat };
