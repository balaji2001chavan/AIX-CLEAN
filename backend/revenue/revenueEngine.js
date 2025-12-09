import fs from "fs";
import path from "path";

const LEDGER = path.resolve("C:/Users/HP/BOSS_AIX_OS/backend/revenue/ledger.json");
const RULES = JSON.parse(
  fs.readFileSync(
    path.resolve("C:/Users/HP/BOSS_AIX_OS/backend/revenue/commissionRules.json"),
    "utf8"
  )
);

function loadLedger() {
  if (!fs.existsSync(LEDGER)) return [];
  return JSON.parse(fs.readFileSync(LEDGER, "utf8"));
}

function saveLedger(data) {
  fs.writeFileSync(LEDGER, JSON.stringify(data, null, 2));
}

function commissionPct(category) {
  return RULES.categories[category] ?? RULES.default_commission_pct;
}

export function recordTransaction(tx) {
  const ledger = loadLedger();

  const commission = (tx.amount * commissionPct(tx.category)) / 100;
  const platformShare = (commission * RULES.platform_share_pct) / 100;
  const ownerShare = (commission * RULES.owner_share_pct) / 100;

  const entry = {
    id: "TX-" + Date.now(),
    merchant_id: tx.merchant_id,
    country: tx.country,
    category: tx.category,
    amount: tx.amount,
    commission,
    platformShare,
    ownerShare,
    date: new Date().toISOString()
  };

  ledger.push(entry);
  saveLedger(ledger);

  return entry;
}

export function getSummary() {
  const ledger = loadLedger();

  const sum = ledger.reduce(
    (a, b) => {
      a.total += b.amount;
      a.commission += b.commission;
      a.platform += b.platformShare;
      a.owner += b.ownerShare;
      return a;
    },
    { total: 0, commission: 0, platform: 0, owner: 0 }
  );

  return { count: ledger.length, ...sum };
}