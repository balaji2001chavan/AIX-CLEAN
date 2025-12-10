export function generatePlan(text) {
  return {
    plan: `Plan generated for: ${text}`,
    needsApproval: true
  };
}
