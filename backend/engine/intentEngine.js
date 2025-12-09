export function parseIntent(text = "") {
  const t = text.toLowerCase();

  if (t.includes("ऑफर") || t.includes("offer"))
    return "INCREASE_OFFERS";

  if (t.includes("focus") || t.includes("लक्ष"))
    return "FOCUS_MARKET";

  if (t.includes("profit") || t.includes("कमाई"))
    return "SHOW_PROFIT";

  return "UNKNOWN";
}