import { reasoningEngine } from "../brain/reasoning.js";
import { decisionEngine } from "../brain/decision.js";
import { ethicsCheck } from "../brain/ethics.js";

export async function aixCommand(req, res) {
  const input = req.body.query;

  const reasoning = reasoningEngine(input);
  const decision = decisionEngine(reasoning);
  const ethics = ethicsCheck(decision);

  res.json({
    success: ethics.allowed,
    intent: reasoning.intent,
    context: reasoning.context,
    response: ethics.finalResponse
  });
}
catch (error) {
    return res.status(500).json({ error: "AIX Error" });
  }
}
