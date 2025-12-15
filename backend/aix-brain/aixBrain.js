import { wrapReply } from "../core/persona/aixPersona.js";

export function aixBrain({ message, memory }) {
  const t = message.toLowerCase();

  // 1) Ambiguous / discussion
  if (t.includes("माहिती") || t.includes("कसं") || t.includes("का") || t.includes("help")) {
    return {
      state: "ADVISE",
      reply: wrapReply({
        message:
          "मी समजलो बॉस. आधी थोडं स्पष्ट करूया—तुम्हाला फक्त माहिती हवी आहे की मी काही रियल करून दाखवू?"
      })
    };
  }

  // 2) Clear intent but needs clarification
  if (t.includes("₹") || t.includes("कपडे") || t.includes("product")) {
    return {
      state: "PROPOSE",
      proposal: {
        type: "PRODUCT_SEARCH",
        ask: "men, women की kids?",
        impact:
          "मी लाईव्ह प्रॉडक्ट्स शोधेन, थेट स्क्रीन उघडेल. कोणताही खर्च AIX करत नाही; व्यवहार seller कडे होतो."
      },
      reply: wrapReply({
        message:
          "बरं बॉस 👍 मी प्रॉडक्ट्स शोधू शकतो. त्याआधी एक गोष्ट—men, women की kids? \nपरिणाम: लाईव्ह items + थेट open. करू का?"
      })
    };
  }

  // 3) Permission to act
  if (t === "हो" || t.includes("करा") || t.includes("apply")) {
    return { state: "ACT" };
  }

  // Default human conversation
  return {
    state: "ADVISE",
    reply: wrapReply({
      message:
        "मी ऐकतोय बॉस. थोडं अजून सांगा म्हणजे योग्य सल्ला देईन."
    })
  };
}
