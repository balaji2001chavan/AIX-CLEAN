export function detectIntent(text) {
  const lower = text.toLowerCase();

  if (lower.includes("app") && (lower.includes("create") || lower.includes("बनव") || lower.includes("तयार") || lower.includes("तयार कर")))
    return { task: "build_app", input: text };

  if (lower.includes("file") || lower.includes("फाईल"))
    return { task: "create_file", input: text };

  if (lower.includes("analyze") || lower.includes("analysis") || lower.includes("विश्लेषण"))
    return { task: "analyze", input: text };

  if (lower.includes("काय") || lower.includes("how") || lower.includes("guide"))
    return { task: "advisor", input: text };

  if (lower.includes("search") || lower.includes("शोध"))
    return { task: "search", input: text };

  if (lower.includes("predict") || lower.includes("भविष्य"))
    return { task: "predict", input: text };

  return { task: "chat", input: text };
}