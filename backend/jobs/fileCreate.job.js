import fs from "fs";
import path from "path";
import {
  startJob,
  updateJob,
  completeJob,
  failJob
} from "./jobStore.js";

export async function runFileCreateJob(job, payload) {
  try {
    // 1. Job start
    startJob(job.id, "Preparing output directory");

    // 👉 FINAL PATH (IMPORTANT)
    const dir = path.join(process.cwd(), "backend", "output");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    updateJob(job.id, "Writing file");

    const filePath = path.join(dir, payload.filename);

    fs.writeFileSync(
      filePath,
      payload.content,
      "utf8"
    );

    updateJob(job.id, "File created successfully");
    completeJob(job.id);

  } catch (err) {
    failJob(job.id, err.message);
  }
}
