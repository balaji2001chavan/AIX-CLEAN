import { reasoningEngine } from "../brain/reasoning.js";
import { decisionEngine } from "../brain/decision.js";
import { ethicsCheck } from "../brain/ethics.js";
import { executeAction } from "../action/action.executor.js";

// Self-change imports
import { detectSelfChangeIntent } from "../self-change/change.detector.js";
import { planChange } from "../self-change/change.planner.js";
import { generateChange } from "../self-change/change.generator.js";
import { buildProof } from "../self-change/change.proof.js";

export async function aixCommand(req, res) {
  try {
    const input = req.body.query;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: "Query दिलेली नाही"
      });
    }

    /* ===============================
       🔁 SELF CHANGE MODE (AIX स्वतः बदल सुचवतो)
    ================================ */
    const isSelfChange = detectSelfChangeIntent(input);

    if (isSelfChange) {
      const plan = planChange(input);
      const change = generateChange(plan);
      const proof = buildProof();

      return res.json({
        success: true,
        mode: "SELF_CHANGE_PROPOSAL",
        message: "मी स्वतःमध्ये खालील बदल सुचवतोय",
        plan,
        change,
        proof,
        approvalRequired: true
      });
    }

    /* ===============================
       🧠 NORMAL AIX FLOW
    ================================ */

    const reasoning = reasoningEngine(input);
    const decision = decisionEngine(reasoning);
    const ethics = ethicsCheck(decision);

    if (!ethics.allowed) {
      return res.json({
        success: false,
        response: ethics.finalResponse
      });
    }

    const execution = executeAction({
      goal: input,
      context: reasoning.context
    });

    return res.json({
      success: true,
      intent: reasoning.intent,
      context: reasoning.context,
      decision: decision.suggestion,
      execution
    });

  } catch (error) {
    console.error("AIX ERROR:", error);
    return res.status(500).json({
      success: false,
      error: "Internal AIX Error"
    });
  }
                                    }
