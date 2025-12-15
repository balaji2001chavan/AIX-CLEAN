let jobs = {};

export function createJob(title) {
  const id = "job-" + Date.now();
  jobs[id] = {
    id,
    title,
    status: "WAITING",
    startedAt: null,
    currentStep: "Waiting for approval",
    error: null
  };
  return jobs[id];
}

export function startJob(id, step) {
  jobs[id].status = "RUNNING";
  jobs[id].startedAt = Date.now();
  jobs[id].currentStep = step;
}

export function updateJob(id, step) {
  jobs[id].currentStep = step;
}

export function completeJob(id) {
  jobs[id].status = "DONE";
  jobs[id].currentStep = "Completed successfully";
}

export function failJob(id, error) {
  jobs[id].status = "FAILED";
  jobs[id].error = error;
  jobs[id].currentStep = "Failed";
}

export function getJob(id) {
  return jobs[id];
}
