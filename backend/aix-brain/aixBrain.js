import { wrapReply } from "../core/persona/aixPersona.js";

export function aixBrain({ message, memory }) {
  const t = message.toLowerCase();

  // 1️⃣ Casual / emotional / vague
  if (
    t.includes("समज") ||
    t.includes("help") ||
    t.includes("काय करायचं") ||
    t.length < 4
  ) {
    return {
      mode: "EXPLAIN",
      reply: wrapReply({
        message:
          "मी समजलो बॉस. निवांत बोला. तुम्हाला माहिती हवी आहे, सल्ला हवा आहे की मी काही रियल करून दाखवू?"
      })
    };
  }

  // 2️⃣ Knowledge / discussion
  if (t.includes("माहिती") || t.includes("future") || t.includes("market")) {
    return {
      mode: "EXPLAIN",
      reply: wrapReply({
        message:
          "हा विषय महत्वाचा आहे बॉस. मी आधी थोडं समजावतो, मग पुढचं योग्य पाऊल सांगतो."
      })
    };
  }

  // 3️⃣ Clear but needs confirmation
  if (t.includes("₹") || t.includes("कपडे") || t.includes("product")) {
    return {
      mode: "PROPOSE",
      proposal: {
        type: "PRODUCT_SEARCH",
        impact:
          "मी लाईव्ह प्रॉडक्ट्स शोधेन. थेट seller ची स्क्रीन उघडेल. कोणताही व्यवहार AIX करत नाही."
      },
      reply: wrapReply({
        message:
          "बरं बॉस 👍 मी प्रॉडक्ट्स शोधू शकतो.\nआधी confirm करा – men, women की kids?\nपरिणाम: लाईव्ह items + थेट स्क्रीन. करू का?"
      })
    };
  }

  // 4️⃣ Permission to act
  if (t === "हो" || t.includes("करा") || t.includes("apply")) {
    return { mode: "ACT" };
  }

  // Default – human chat
  return {
    mode: "EXPLAIN",
    reply: wrapReply({
      message:
        "मी ऐकतोय बॉस. थोडं अजून स्पष्ट केलंत तर अचूक उत्तर देईन."
    })
  };
}
