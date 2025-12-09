import fs from "fs";
import path from "path";

const LEDGER = path.resolve("C:/Users/HP/BOSS_AIX_OS/backend/revenue/ledger.json");

function loadLedger() {
  if (!fs.existsSync(LEDGER)) return [];
  return JSON.parse(fs.readFileSync(LEDGER, "utf8"));
}

export function dailySummary(date = new Date().toISOString().slice(0,10)) {
  const data = loadLedger().filter(x => x.date.startsWith(date));
  return summarize(data);
}

export function monthlySummary(ym = new Date().toISOString().slice(0,7)) {
  const data = loadLedger().filter(x => x.date.startsWith(ym));
  return summarize(data);
}

export function byCountry() {
  const data = loadLedger();
  return groupSum(data, "country");
}

export function byCategory() {
  const data = loadLedger();
  return groupSum(data, "category");
}

function summarize(rows) {
  return rows.reduce((a,b)=>{
    a.count++; a.total+=b.amount; a.commission+=b.commission;
    a.platform+=b.platformShare; a.owner+=b.ownerShare;
    return a;
  },{count:0,total:0,commission:0,platform:0,owner:0});
}

function groupSum(rows, key) {
  return rows.reduce((m,r)=>{
    m[r[key]] ??= {total:0, commission:0};
    m[r[key]].total += r.amount;
    m[r[key]].commission += r.commission;
    return m;
  },{});
}