export function buildContext(input, intent) {
  return {
    intent,
    time: new Date().toISOString(),
    riskLevel: intent.includes("DECISION") ? "MEDIUM" : "LOW",
    domain: intent.includes("BUY") ? "MARKET" : "GENERAL"
  };
}
