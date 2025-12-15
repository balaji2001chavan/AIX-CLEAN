export async function think(input, keyData) {
  return {
    intent: "analysis",
    topic: input,
    liveSignals: ["market", "tech", "trend"],
    allowedTools: keyData.plan
  };
}
