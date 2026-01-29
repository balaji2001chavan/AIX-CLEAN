module.exports = function planner(intent, message) {
  if (intent === "WEBSITE") {
    return [
      "Define website goal",
      "Create page structure",
      "Generate content",
      "Suggest deployment"
    ];
  }

  if (intent === "BUSINESS") {
    return [
      "Business model",
      "Target audience",
      "Revenue plan",
      "Launch steps"
    ];
  }

  if (intent === "MARKETING") {
    return [
      "Platform selection",
      "Content ideas",
      "Ad copy",
      "Lead funnel"
    ];
  }

  return ["Answer conversationally"];
};
