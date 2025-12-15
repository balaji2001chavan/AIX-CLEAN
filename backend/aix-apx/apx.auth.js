const AIX_KEYS = [
  { key: "AIX_PRIVATE_001", plan: "PRIVATE", automation: true },
  { key: "AIX_PUBLIC_FREE", plan: "FREE", automation: false }
];

export function verifyAIXKey(req) {
  const auth = req.headers.authorization;
  if (!auth) return { allowed: false, reason: "API key missing" };

  const token = auth.replace("Bearer ", "");
  const found = AIX_KEYS.find(k => k.key === token);

  if (!found) return { allowed: false, reason: "Invalid AIX API key" };

  return { allowed: true, plan: found.plan, automation: found.automation };
}
