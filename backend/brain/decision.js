export function decisionEngine(reasoning) {
  return {
    decision: "respond",
    message: reasoning.content,
  };
}
