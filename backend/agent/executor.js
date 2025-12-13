import { createFile } from "../tools/file.tool.js";
import { writeCodeFile } from "../tools/code.tool.js";
import { gitCommitAndPush } from "../tools/git.tool.js";

export async function executeSteps(steps) {
  const results = [];

  for (const step of steps) {
    if (step.action === "create_file") {
      const r = createFile(
        "planner-demo.txt",
        "ही फाइल AIX planner ने तयार केली आहे."
      );
      results.push(`✅ File created: ${r.path}`);
    }

    if (step.action === "write_code") {
      const code = `// Planner generated code
export function demo() {
  return "Planner + Executor working";
}
`;
      const r = writeCodeFile("planner-code.js", code);
      results.push(`✅ Code written: ${r.path}`);
    }

    if (step.action === "git_commit") {
      results.push("❓ GitHub commit requires approval (YES COMMIT)");
    }
  }

  return results;
}
