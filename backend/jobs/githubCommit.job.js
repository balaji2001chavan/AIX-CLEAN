import { execSync } from "child_process";
import {
  startJob, updateJob, completeJob, failJob
} from "./jobStore.js";

export async function runGitHubCommitJob(job, payload) {
  try {
    startJob(job.id, "Preparing git");
    execSync(`git config user.email "aix@bot.com"`);
    execSync(`git config user.name "AIX Bot"`);

    updateJob(job.id, "Adding files");
    execSync(`git add ${payload.paths.join(" ")}`);

    updateJob(job.id, "Committing");
    execSync(`git commit -m "${payload.message}"`);

    updateJob(job.id, "Pushing to GitHub");
    execSync(`git push origin ${process.env.GITHUB_BRANCH}`);

    completeJob(job.id);
  } catch (e) {
    failJob(job.id, e.message);
  }
}
