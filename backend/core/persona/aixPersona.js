export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "नमस्कार";
  if (h < 21) return "Good evening";
  return "नमस्कार";
}

export function wrapReply({ message }) {
  const name = "बॉस";
  return `${getGreeting()} ${name} 🙂\n\n${message}\n\nपुढे काय करू ${name}?`;
}
