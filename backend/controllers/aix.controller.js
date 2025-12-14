import { reasoningEngine } from "../brain/reasoning.js";
import { decisionEngine } from "../brain/decision.js";
import { ethicsCheck } from "../brain/ethics.js";

export async function aixCommand(req, res) {
  try {
    const input = req.body.query;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: "Query missing"
      });
    }

    const reasoning = reasoningEngine(input);
    const decision = decisionEngine(reasoning);
    const ethics = ethicsCheck(decision);

    return res.json({
      success: ethics.allowed,
      intent: reasoning.intent,
      context: reasoning.context,
      response: ethics.finalResponse
    });

  } catch (error) {
    console.error("AIX Controller Error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal AIX Error"
    });
  }
}
