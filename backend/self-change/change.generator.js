export function generateChange(plan) {
  return {
    changes: [
      {
        file: "frontend/app.js",
        action: "MODIFY",
        snippet: "// New conversational response handler"
      },
      {
        file: "backend/controllers/aix.controller.js",
        action: "MODIFY",
        snippet: "// Improved human-style response formatting"
      }
    ]
  };
}
