export function buildResponse({ speech, actionResult, plan }) {
  return {
    plan,
    reply: speech,
    execution: actionResult
  };
}
