import { discoverMarketOpportunities } from "./market/discoveryEngine.js";

const data = [
  {
    city: "Pune",
    category: "fashion",
    demand: 0.8,
    supply_gap: 0.6,
    competition: 0.3
  },
  {
    city: "Nashik",
    category: "grocery",
    demand: 0.5,
    supply_gap: 0.2,
    competition: 0.7
  },
  {
    city: "Indore",
    category: "services",
    demand: 0.7,
    supply_gap: 0.7,
    competition: 0.2
  }
];

console.log(discoverMarketOpportunities(data));