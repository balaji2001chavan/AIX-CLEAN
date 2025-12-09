import { getLawForCountry, validateAction } from "./engine/lawEngine.js";

const lawIN = getLawForCountry("IN");
const check = validateAction({ type: "SET_DISCOUNT", value: 70 }, lawIN);

console.log("LAW:", lawIN);
console.log("CHECK:", check);