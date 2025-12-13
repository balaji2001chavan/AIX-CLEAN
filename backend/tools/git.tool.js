import { execSync } from "child_process";

export function gitCommitAndPush(message = "AIX auto commit") {
  try {
    const status = execSync("git status --porcelain").toString();

    if (!status.trim()) {
      return {
        success: false,
        message: "No changes to commit"
      };
    }

    execSync("git add .");
    execSync(`git commit -m "${message}"`);
    execSync("git push");

    return {
      success: true,
      message: "Code committed and pushed to GitHub"
    };
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
}
