export function detectLanguage(text) {
  if (text.match(/[अ-ह]/)) return "Marathi";
  if (text.match(/[a-zA-Z]/)) return "English";
  return "Unknown";
}
