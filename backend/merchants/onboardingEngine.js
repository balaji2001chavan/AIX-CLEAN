import fs from "fs";
import path from "path";

const DB = path.resolve("C:/Users/HP/BOSS_AIX_OS/backend/merchants/merchants.json");

function loadMerchants() {
  if (!fs.existsSync(DB)) return [];
  return JSON.parse(fs.readFileSync(DB, "utf8"));
}

function saveMerchants(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

export function onboardMerchant(profile) {
  const merchants = loadMerchants();

  profile.id = "M-" + Date.now();
  profile.onboarded = true;
  profile.joined_at = new Date().toISOString();

  merchants.push(profile);
  saveMerchants(merchants);

  return {
    status: "ONBOARDED",
    message: "AIX will grow your business and share profits",
    merchant_id: profile.id
  };
}