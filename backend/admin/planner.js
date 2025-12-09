export function generatePlan(command) {
  const text = command.toLowerCase();

  if (text.includes("feature")) {
    return {
      type: "FEATURE_ADD",
      plan: [
        "Create engine file",
        "Add route",
        "Update frontend UI",
        "Register feature",
        "Test & enable"
      ],
      files: [
        "engines/<feature>.js",
        "routes/<feature>.js",
        "frontend/<feature>.html"
      ]
    };
  }

  return {
    type: "UNKNOWN",
    plan: ["Ask clarification from Boss"],
    files: []
  };
}