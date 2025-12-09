import { dailySummary, byCountry, byCategory } from "../dashboards/dashboardEngine.js";
import { getLawForCountry } from "../engine/lawEngine.js";
import { getBusinessRules } from "../engine/businessRuleEngine.js";

export function generateSuggestions() {
  const daily = dailySummary();
  const countries = byCountry();
  const categories = byCategory();
  const rules = getBusinessRules();

  const suggestions = [];

  // Offer suggestion if daily total low vs target
  if (daily.total < rules.daily_profit_target) {
    suggestions.push({
      action: "INCREASE_OFFERS",
      reason: "Daily revenue below target",
      note: "Use limited-time offers within country discount caps"
    });
  }

  // Country focus
  for (const c in countries) {
    if (countries[c].commission > daily.commission * 0.3) {
      const law = getLawForCountry(c);
      suggestions.push({
        action: "FOCUS_MARKET",
        target: c,
        reason: "High commission contribution",
        constraint: `Max discount ${law.max_discount}%`
      });
    }
  }

  // Category pricing
  for (const k in categories) {
    const margin = categories[k].commission / Math.max(1, categories[k].total);
    if (margin > 0.12) {
      suggestions.push({
        action: "INCREASE_PRICE",
        category: k,
        reason: "Strong margin relative to total",
        cap: `${rules.price_change_pct.max}%`
      });
    }
  }

  if (!suggestions.length) {
    suggestions.push({
      action: "HOLD",
      reason: "System stable. No aggressive moves advised."
    });
  }

  return {
    generated_at: new Date().toISOString(),
    suggestions
  };
}