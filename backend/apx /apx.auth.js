// AIX AUTH CORE – NO EXTERNAL KEY

const AIX_KEYS = [
  {
    key: "AIX_PRIVATE_001",
    plan: "PRIVATE",
    automation: true,
    limit: Infinity
  },
  {
    key: "AIX_PUBLIC_FREE",
    plan: "FREE",
    automation: false,
    limit: 50
  }
];

export function verifyAIXKey(authHeader) {
  if (!authHeader) {
    return { allowed: false, reason: "API key missing" };
  }

  const key = authHeader.replace("Bearer ", "");

  const found = AIX_KEYS.find(k => k.key === key);

  if (!found) {
    return { allowed: false, reason: "Invalid AIX API key" };
  }

  return {
    allowed: true,
    plan: found.plan,
    automation: found.automation,
    limit: found.limit
  };
}
