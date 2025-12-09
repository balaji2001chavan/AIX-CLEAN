import fs from "fs";
import { scanProject } from "./scanProject.js";
import { decide } from "./intelligence.js";

export function smartActivate() {
  const rules = JSON.parse(
    fs.readFileSync("./config/intelligence_rules.json")
  );

  const scan = scanProject();
  const decision = decide(scan, rules);

  // FEATURE FLAGS AUTO UPDATE
  const featuresFile = "./config/features.json";
  const features = JSON.parse(fs.readFileSync(featuresFile));

  decision.activate.forEach(item => {
    if (item.includes("voice")) features.voice = true;
    if (item.includes("chat")) features.chat = true;
  });

  fs.writeFileSync(featuresFile, JSON.stringify(features, null, 2));

  return {
    status: "SMART ACTIVATION DONE",
    activated: decision.activate,
    ignored: decision.ignore
  };
}