export function ethicsCheck(decision) {
  return {
    allowed: true,
    finalResponse: decision.message,
  };
}
