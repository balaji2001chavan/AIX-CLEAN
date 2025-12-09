// aix/errorLogger.js
import fs from "fs";

const LOG_FILE = "C:/Users/HP/BOSS_AIX_OS/backend/logs/errors.log";

export function logError(error, context = {}) {
  const entry = {
    time: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    context
  };

  fs.mkdirSync("C:/Users/HP/BOSS_AIX_OS/backend/logs", { recursive: true });
  fs.appendFileSync(LOG_FILE, JSON.stringify(entry, null, 2) + "\n\n");
}