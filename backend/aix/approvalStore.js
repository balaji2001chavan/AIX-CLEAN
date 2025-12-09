// aix/approvalStore.js

const approvals = new Map();

/**
 * Save plan for approval
 */
export function savePlan(id, plan) {
  approvals.set(id, {
    plan,
    status: "PENDING",
    time: new Date().toISOString()
  });
}

/**
 * Get plan by ID
 */
export function getPlan(id) {
  return approvals.get(id);
}

/**
 * Approve or reject plan
 */
export function updateStatus(id, status) {
  if (!approvals.has(id)) return null;

  const item = approvals.get(id);
  item.status = status;
  approvals.set(id, item);
  return item;
}