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
    startJob(job.id, "Creating file");

    const dir = path.join(process.cwd(), "output");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    updateJob(job.id, "Writing content");

    const filePath = path.join(dir, payload.filename);
    fs.writeFileSync(filePath, payload.content, "utf8");

    updateJob(job.id, "Finalizing");
    completeJob(job.id);
  } catch (err) {
    failJob(job.id, err.message);
  }
}
