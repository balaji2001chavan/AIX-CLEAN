import fs from "fs";

const rules = JSON.parse(
  fs.readFileSync(
    "C:/Users/HP/BOSS_AIX_OS/backend/auto/autoRules.json",
    "utf8"
  )
);

export function isAutoAllowed(intent) {
  return rules.AUTO_ALLOWED.includes(intent);
}