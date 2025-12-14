import { reasoningEngine } from "../brain/reasoning.js";
import { decisionEngine } from "../brain/decision.js";
import { ethicsCheck } from "../brain/ethics.js";
import { executeAction } from "../action/action.executor.js";

export async function aixCommand(req, res) {
  try {
    const input = req.body.query;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: "Query / Goal दिलेला नाही"
      });
    }

    // 1️⃣ Reasoning
    const reasoning = reasoningEngine(input);

    // 2️⃣ Decision
    const decision = decisionEngine(reasoning);

    // 3️⃣ Ethics check
    const ethics = ethicsCheck(decision);

    if (!ethics.allowed) {
      return res.json({
        success: false,
        response: ethics.finalResponse
      });
    }

    // 4️⃣ REAL ACTION EXECUTION
    const execution = executeAction({
      goal: input,
      context: reasoning.context
    });

    // 5️⃣ FINAL RESPONSE
    return res.json({
      success: true,
      intent: reasoning.intent,
      context: reasoning.context,
      decision: decision.suggestion,
      execution: execution
    });

  } catch (error) {
    console.error("AIX CONTROLLER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Internal AIX Server Error"
    });
  }
}
