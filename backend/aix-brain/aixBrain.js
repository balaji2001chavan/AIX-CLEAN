import { wrapReply } from "../core/persona/aixPersona.js";
import { getMemory, setMemory } from "../memory/memoryStore.js";

export function aixBrain({ message }) {
  const t = message.toLowerCase().trim();
  const memory = getMemory();

  // Permission
  if (t === "हो" || t === "yes" || t.includes("करा")) return { mode: "ACT" };

  // Knowledge intent
  if (t.includes("घडामोड") || t.includes("news") || t.includes("future") || t.includes("market")) {
    setMemory({ lastTopic: "knowledge" });
    return {
      mode: "EXPLAIN",
      reply: wrapReply({
        message:
          "मी general trends समजावतो बॉस. लाईव्ह verify करायचं असेल तर सांगा—करू का?"
      })
    };
  }
// Repo read intent
if (
  t.includes("repo") ||
  t.includes("code वाच") ||
  t.includes("प्रोजेक्ट तपास") ||
  t.includes("फोल्डर")
) {
  return {
    mode: "READ_CODE"
  };
}
  // Product intent (advisor-first)
  if (t.includes("₹") || t.includes("कपडे") || t.includes("product")) {
    setMemory({ lastProposal: { type: "PRODUCT_SEARCH" } });
    return {
      mode: "PROPOSE",
      reply: wrapReply({
        message:
          "₹300 मध्ये प्रॉडक्ट्स शोधू शकतो.\nmen, women की kids?\nपरिणाम: लाईव्ह items + थेट स्क्रीन. करू का?"
      })
    };
  }

  return {
    mode: "EXPLAIN",
    reply: wrapReply({
      message:
        "मी ऐकतोय बॉस. माहिती, सल्ला की रियल काम—काय हवं आहे?"
    })
  };
}
