/**
 * AIX Planner
 * User prompt → list of executable steps
 */

export function planSteps(prompt) {
  const text = prompt.toLowerCase();
  const steps = [];

  if (text.includes("file")) {
    steps.push({ action: "create_file" });
  }

  if (text.includes("code") || text.includes("कोड")) {
    steps.push({ action: "write_code" });
  }

  if (text.includes("github") || text.includes("commit")) {
    steps.push({ action: "git_commit" });
  }

  return steps;
}
