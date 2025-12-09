import { validateBusinessAction, getBusinessRules } from "./engine/businessRuleEngine.js";

console.log("RULES:", getBusinessRules());

const test = validateBusinessAction(
  { type: "SET_PRICE", pct_change: 60 },
  { projectedLoss: 10000 }
);

console.log("CHECK:", test);