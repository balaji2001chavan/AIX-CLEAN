export function verifyKey(key) {
  if (!key) return { allowed: false };

  if (key.includes("AIX_PRIVATE")) {
    return { allowed: true, plan: "PRIVATE", automation: "full" };
  }

  if (key.includes("AIX_PRO")) {
    return { allowed: true, plan: "PRO", automation: "limited" };
  }

  if (key.includes("AIX_FREE")) {
    return { allowed: true, plan: "FREE", automation: "none" };
  }

  return { allowed: false };
}
