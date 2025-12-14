import { detectLanguage } from "../language/language.detect.js";
import { reasoningEngine } from "../brain/reasoning.js";
import { decisionEngine } from "../brain/decision.js";
import { ethicsCheck } from "../brain/ethics.js";

export async function aixCommand(req, res) {
  try {
    const userInput = req.body.query;

    if (!userInput) {
      return res.status(400).json({ error: "Query missing" });
    }

    const language = detectLanguage(userInput);

    const reasoning = reasoningEngine(userInput);
    const decision = decisionEngine(reasoning);
    const ethics = ethicsCheck(decision);

    return res.json({
      success: true,
      language,
      response: ethics.finalResponse,
    });

  } catch (error) {
    return res.status(500).json({ error: "AIX Error" });
  }
}
