import { AIX_AUTONOMOUS_CYCLE } from "../ai/autonomous.js";

console.log("AIX AUTONOMOUS MODE → ACTIVE");

setInterval(() => {
    AIX_AUTONOMOUS_CYCLE();
}, 5000); // every 5 sec