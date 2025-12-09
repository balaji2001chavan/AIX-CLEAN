export function executeAction(intent) {
  if (intent === "INCREASE_OFFERS") {
    return {
      done: true,
      message: "✅ Offers increased safely"
    };
  }

  if (intent === "FOCUS_MARKET") {
    return {
      done: true,
      message: "✅ Market focus updated"
    };
  }

  return {
    done: false,
    message: "❌ Action not allowed"
  };
}