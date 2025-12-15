export function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "नमस्कार";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "नमस्कार";
}

export function wrapReply({ message }) {
  const name = "बॉस";
  const greeting = getGreeting();

  return `${greeting} ${name} 😊

${message}

पुढे काय करू ${name}?`;
      }
