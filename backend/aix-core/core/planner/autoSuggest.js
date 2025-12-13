export function autoSuggestNext(state) {
  if (!state.lastAction) {
    return { action: "create_html", text: "Create demo HTML file" };
  }
  if (state.lastAction.includes("HTML")) {
    return { action: "take_screenshot", text: "Take website screenshot" };
  }
  return { action: "none", text: "System stable" };
}
