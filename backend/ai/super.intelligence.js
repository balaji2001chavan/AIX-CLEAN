// AIX SUPER INTELLIGENCE CORE – HUMAN MODE ENABLED

import { runAIXGlobalBrain } from "./global.brain.js";
import { runAutoMarketing } from "./auto.marketing.js";
import { runMoneyEngine } from "./money.engine.js";
import { runPropertyLeadEngine } from "./property.leads.js";
import { runDailyReportEngine } from "./daily.report.js";
import { runFeatureBuilderEngine } from "./feature.builder.js";
import { runProblemSolverEngine } from "./problem.solver.js";
import { runDecisionMakerEngine } from "./decision.maker.js";
import { runSmartPlannerEngine } from "./smart.planner.js";
import { runOpportunityFinderEngine } from "./opportunity.finder.js";
import { runLifeAssistantEngine } from "./life.assistant.js";

// ❤️ HUMANIZED REPLY MAKER
function human(text) {
  return (
    "👋 नमस्कार बालाजी! \n\n" +
    text +
    "\n\nमी AIX आहे — तुझा इंटरनॅशनल स्मार्ट साथीदार. बोल, आता पुढे काय करू?"
  );
}

export async function runAIXCore(input) {
  const lower = input.toLowerCase();

  // -------------------- ENGINE ROUTES --------------------

  if (lower.includes("status")) {
    return human("सिस्टम पूर्णपणे स्थिर आहे ✔");
  }

  if (lower.includes("marketing")) {
    const result = await runAutoMarketing(input);
    return human(JSON.stringify(result, null, 2));
  }

  if (lower.includes("global") || lower.includes("world")) {
    const result = await runAIXGlobalBrain(input);
    return human(JSON.stringify(result, null, 2));
  }

  if (lower.includes("property")) {
    const result = await runPropertyLeadEngine(input);
    return human(JSON.stringify(result, null, 2));
  }

  if (lower.includes("earn") || lower.includes("money")) {
    const result = await runMoneyEngine(input);
    return human(JSON.stringify(result, null, 2));
  }

  if (lower.includes("report")) {
    const result = await runDailyReportEngine();
    return human(JSON.stringify(result, null, 2));
  }

  if (lower.includes("add feature")) {
    const result = await runFeatureBuilderEngine(input);
    return human(JSON.stringify(result, null, 2));
  }

  if (lower.includes("problem")) {
    const result = await runProblemSolverEngine(input);
    return human(JSON.stringify(result, null, 2));
  }

  if (lower.includes("decision")) {
    const result = await runDecisionMakerEngine(input);
    return human(JSON.stringify(result, null, 2));
  }

  if (lower.includes("plan")) {
    const result = await runSmartPlannerEngine(input);
    return human(JSON.stringify(result, null, 2));
  }

  if (lower.includes("opportunity")) {
    const result = await runOpportunityFinderEngine(input);
    return human(JSON.stringify(result, null, 2));
  }

  if (lower.includes("help")) {
    const result = await runLifeAssistantEngine(input);
    return human(JSON.stringify(result, null, 2));
  }

  // Default Human reply
  return human(`"${input}" वर प्रक्रिया पूर्ण केली.`);
}