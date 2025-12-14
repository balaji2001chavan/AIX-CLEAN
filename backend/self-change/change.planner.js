export function planChange(input) {
  return {
    summary: "Conversational response सुधारणा",
    filesToChange: [
      "frontend/app.js",
      "backend/controllers/aix.controller.js"
    ],
    reason: "ChatGPT-style natural conversation"
  };
}
