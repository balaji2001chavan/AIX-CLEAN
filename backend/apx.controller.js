import { verifyKey } from "./apx.auth.js";
import { think } from "./apx.tools.js";
import { act } from "./apx.actions.js";
import { speak } from "./apx.llm.js";
import { buildResponse } from "./apx.response.js";
import { saveMemory } from "./apx.memory.js";

export async function apx(req, res) {
  try {
    const apiKey = req.headers.authorization;
    const input = req.body.input || "";

    // 1️⃣ AUTH
    const keyData = verifyKey(apiKey);
    if (!keyData.allowed) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    // 2️⃣ THINK (Intent + Context + Live signals)
    const thought = await think(input, keyData);

    // 3️⃣ ACTION (Auto / Plan / Approval)
    const actionResult = await act(thought, keyData);

    // 4️⃣ SPEAK (ChatGPT-style explain)
    const speech = await speak({
      input,
      thought,
      actionResult,
      plan: keyData.plan
    });

    // 5️⃣ MEMORY + PROOF
    saveMemory({ input, thought, actionResult });

    // 6️⃣ FINAL RESPONSE
    return res.json(
      buildResponse({
        speech,
        actionResult,
        plan: keyData.plan
      })
    );

  } catch (err) {
    console.error("AIX APX ERROR:", err);
    res.status(500).json({ error: "AIX APX internal error" });
  }
}
