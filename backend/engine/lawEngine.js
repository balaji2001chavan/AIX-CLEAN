import fs from "fs";
import path from "path";

const LAW_DIR = path.resolve("C:/Users/HP/BOSS_AIX_OS/backend/laws");

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function getLawForCountry(code = "default") {
  const base = readJSON(path.join(LAW_DIR, "global.json"));
  const countryFile = path.join(LAW_DIR, `${code.toLowerCase()}.json`);

  if (fs.existsSync(countryFile)) {
    return { ...base.default, ...readJSON(countryFile) };
  }
  return base.default;
}

export function validateAction(action, law) {
  if (action.type === "SET_DISCOUNT") {
    if (action.value > law.max_discount) {
      return { allowed: false, reason: "DISCOUNT_LIMIT_EXCEEDED" };
    }
  }

  if (action.type === "AUTO_PAYOUT" && !law.payout_allowed) {
    return { allowed: false, reason: "PAYOUT_NOT_ALLOWED" };
  }

  return { allowed: true };
}