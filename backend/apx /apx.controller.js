import { verifyAIXKey } from "./apx.auth.js";
import { aixThink } from "./apx.logic.js";
import { aixAct } from "./apx.actions.js";

export async function apxController(req, res) {
  try {
    const auth = req.headers.authorization;
    const input = req.body.input;

    if (!input) {
      return res.status(400).json({ error: "Input missing" });
    }

    // 1️⃣ API KEY CHECK
    const keyData = verifyAIXKey(auth);
    if (!keyData.allowed) {
      return res.status(403).json({ error: keyData.reason });
    }

    // 2️⃣ THINK
    const thought = aixThink(input);

    // 3️⃣ ACT
    const action = aixAct(thought.intent, keyData);

    // 4️⃣ FINAL RESPONSE
    return res.json({
      success: true,
      plan: keyData.plan,
      reply: `
मी तुमचं म्हणणं समजून घेतलं आहे.

➡️ विषय: ${thought.intent}
➡️ सुचना: ${thought.suggestion}

${action.message}

पुढे काय करायचं ते सांगा.
      `
    });

  } catch (err) {
    console.error("AIX APX ERROR:", err);
    return res.status(500).json({ error: "AIX internal error" });
  }
}
