export function detectIntent(text) {
  const lower = text.toLowerCase();

  if (lower.includes("खरेदी") || lower.includes("buy"))
    return "BUY_DECISION";

  if (lower.includes("विक्री") || lower.includes("sell"))
    return "SELL_DECISION";

  if (lower.includes("काय") || lower.includes("what"))
    return "QUESTION";

  if (lower.includes("कर") || lower.includes("do"))
    return "COMMAND";

  return "GENERAL";
}
