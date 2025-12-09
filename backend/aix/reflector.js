// aix/reflector.js
import { askAI } from "./ollama.js";
import { findKnownFix } from "./memory.js";

export async function reflectOnError(error, context = {}) {

  // 🧠 FIRST: MEMORY CHECK
  const known = findKnownFix(error.message);

  if (known) {
    return `
KNOWN ISSUE FOUND ✅

Error:
${error.message}

Previously Applied Fix:
${JSON.stringify(known.fix, null, 2)}

Recommendation:
Reuse the same fix. Human approval advised.
`;
  }

  // 🤖 If not in memory → ask AI
  const prompt = `
You are Boss AIX Self-Repair Brain.

A new error happened.

ERROR:
${error.message}

STACK:
${error.stack}

CONTEXT:
${JSON.stringify(context, null, 2)}

TASK:
1. Find root cause
2. Suggest SAFE fix
3. If file change required, reply ONLY in JSON:

{
  "action": "WRITE_FILE",
  "path": "relative/path/file.txt",
  "content": "fixed content"
}

If auto fix not safe, reply: HUMAN REQUIRED
  `;

  return await askAI(prompt);
}