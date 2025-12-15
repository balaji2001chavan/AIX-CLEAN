export function aixThink(input) {
  let intent = "general";

  if (input.includes("सेल") || input.includes("sell")) {
    intent = "sales";
  }
  if (input.includes("मार्केटिंग") || input.includes("marketing")) {
    intent = "marketing";
  }
  if (input.includes("बदल") || input.includes("feature")) {
    intent = "change_request";
  }

  return {
    intent,
    understanding: "User ने काय करायचं आहे ते समजलं आहे",
    suggestion: buildSuggestion(intent)
  };
}

function buildSuggestion(intent) {
  switch (intent) {
    case "sales":
      return "सेल वाढवण्यासाठी content, offer आणि visibility वाढवावी लागेल.";
    case "marketing":
      return "मार्केटिंगसाठी पोस्ट, व्हिडिओ आणि plan तयार करता येईल.";
    case "change_request":
      return "हे बदल plan करून approval घेणं योग्य राहील.";
    default:
      return "तुमचा प्रश्न समजून घेतला आहे. पुढे सविस्तर सांगू शकतो.";
  }
}
