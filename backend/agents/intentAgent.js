module.exports = function detectIntent(message) {
  if (/website|app|landing/i.test(message)) return "WEBSITE";
  if (/business|startup|idea/i.test(message)) return "BUSINESS";
  if (/marketing|ads|leads|instagram/i.test(message)) return "MARKETING";
  return "CHAT";
};
