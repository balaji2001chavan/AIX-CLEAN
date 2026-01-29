const websiteTool = require("../tools/websiteTool");
const businessTool = require("../tools/businessTool");
const marketingTool = require("../tools/marketingTool");

module.exports = function execute(intent, message) {
  if (intent === "WEBSITE") return websiteTool(message);
  if (intent === "BUSINESS") return businessTool(message);
  if (intent === "MARKETING") return marketingTool(message);

  return "I'm listening. Tell me what you want to build.";
};
