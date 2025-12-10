export function executeAction(plan) {
  return {
    done: true,
    result: `Action executed for plan: ${plan}`
  };
}
