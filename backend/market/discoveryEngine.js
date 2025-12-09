import fs from "fs";
import path from "path";

const SIGNALS = JSON.parse(
  fs.readFileSync(
    path.resolve("C:/Users/HP/BOSS_AIX_OS/backend/market/signals.json"),
    "utf8"
  )
);

function scoreOpportunity(demand, supplyGap, competition) {
  return (
    demand * SIGNALS.demand_weight +
    supplyGap * SIGNALS.supply_gap_weight -
    competition * SIGNALS.competition_weight
  );
}

export function discoverMarketOpportunities(sampleData) {
  return sampleData
    .map(item => {
      const score = scoreOpportunity(
        item.demand,
        item.supply_gap,
        item.competition
      );
      return { ...item, score: Math.round(score * 100) };
    })
    .filter(o => o.score > 50)
    .sort((a, b) => b.score - a.score);
}