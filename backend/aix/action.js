import fs from "fs";

/**
 * REAL ACTION ENGINE
 * AI + RULE BASED (FAIL SAFE)
 */
export function runAction(ai, rawCommand = "") {
  const file = "./config/features.json";
  const features = JSON.parse(fs.readFileSync(file));

  const command = rawCommand.toLowerCase();

  // ✅ RULE BASED (AI FAIL SAFE)
  if (command.includes("shopping") && command.includes("on")) {
    features.shopping = true;
  }
  else if (command.includes("shopping") && command.includes("off")) {
    features.shopping = false;
  }
  else if (command.includes("marketing") && command.includes("on")) {
    features.marketing = true;
  }
  else if (command.includes("marketing") && command.includes("off")) {
    features.marketing = false;
  }
  // ✅ AI BASED
  else if (ai?.intent === "feature_on") {
    features[ai.target] = true;
  }
  else if (ai?.intent === "feature_off") {
    features[ai.target] = false;
  }
  else {
    return "NO ACTION (command not understood)";
  }

  fs.writeFileSync(file, JSON.stringify(features, null, 2));
return "AUTO MODE: system stable, no repair needed";
}