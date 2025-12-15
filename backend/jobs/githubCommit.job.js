import { execSync } from "child_process";
import {
  startJob,
  updateJob,
  completeJob,
  failJob
} from "./jobStore.js";

export async function runGitHubCommitJob(job, payload) {
  try {
    startJob(job.id, "Configuring git");

    execSync(`git config user.email "aix-bot@aix.ai"`);
    execSync(`git config user.name "AIX Bot"`);

    updateJob(job.id, "Adding file to git");

    // 👉 FINAL PATH (IMPORTANT)
    execSync(`git add backend/output/${payload.filename}`);

    updateJob(job.id, "Creating commit");
    execSync(`git commit -m "${payload.message}"`);

    updateJob(job.id, "Pushing to GitHub");
    execSync(`git push origin ${process.env.GITHUB_BRANCH}`, {
      stdio: "inherit"
    });

    completeJob(job.id);

  } catch (err) {
    failJob(job.id, err.message);
  }
}
