// super-intent-brain.js
// Lightweight multilingual intent detection (rule based -> can be upgraded to ML later)

export function detectLanguage(text) {
  // very simple heuristic
  if (/[अ-ह]/.test(text)) return "marathi";
  if (/[क-ह]/.test(text) && !/[अ-ह]/.test(text)) return "hindi";
  if (/[a-zA-Z]/.test(text)) return "english";
  return "unknown";
}

export function detectIntent(text) {
  const t = text.toLowerCase();

  // prioritized rules (expand these)
  if (t.includes("app") || t.includes("अॅप") || t.includes("app बनव") || t.includes("app तयार") || t.includes("अ‍ॅप")) {
    return { task: "build_app", confidence: 0.9 };
  }
  if (t.includes("file") || t.includes("फाईल") || t.includes("फाइल") || t.includes("नवीन फाइल")) {
    return { task: "create_file", confidence: 0.9 };
  }
  if (t.includes("login") || t.includes("लॉगिन") || t.includes("sign in")) {
    return { task: "create_login", confidence: 0.88 };
  }
  if (t.includes("भविष्य") || t.includes("future") || t.includes("predict")) {
    return { task: "predict", confidence: 0.7 };
  }
  if (t.includes("काय") || t.includes("how") || t.includes("guide") || t.includes("help")) {
    return { task: "advisor", confidence: 0.6 };
  }

  // default chat
  return { task: "chat", confidence: 0.5 };
}
