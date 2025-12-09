import fs from "fs";
import path from "path";

const RULE_FILE = path.resolve("C:/Users/HP/BOSS_AIX_OS/backend/rules/business.json");

function loadRules() {
  return JSON.parse(fs.readFileSync(RULE_FILE, "utf8"));
}

export function validateBusinessAction(action, context = {}) {
  const rules = loadRules();

  // Profit/Loss guard
  if (context.projectedLoss && context.projectedLoss > rules.max_daily_loss) {
    return { allowed: false, reason: "MAX_DAILY_LOSS_EXCEEDED" };
  }

  // Price change guard
  if (action.type === "SET_PRICE") {
    const pct = action.pct_change;
    if (pct < rules.price_change_pct.min || pct > rules.price_change_pct.max) {
      return { allowed: false, reason: "PRICE_CHANGE_OUT_OF_RANGE" };
    }
  }

  // Discount guard
  if (action.type === "SET_DISCOUNT") {
    if (action.value > rules.max_discount_global) {
      return { allowed: false, reason: "DISCOUNT_TOO_HIGH" };
    }
  }

  return { allowed: true };
}

export function getBusinessRules() {
  return loadRules();
}