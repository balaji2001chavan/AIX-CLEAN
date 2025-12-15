import { wrapReply } from "../core/persona/aixPersona.js";

export function aixBrain({ message, memory }) {
  const t = message.toLowerCase().trim();

  // Permission
  if (t === "हो" || t === "yes" || t.includes("करा")) {
    return { mode: "ACT" };
  }

  // Product intent (advisor-first)
  if (t.includes("₹") || t.includes("कपडे") || t.includes("product")) {
    return {
      mode: "PROPOSE",
      proposal: {
        type: "PRODUCT_SEARCH",
        impact:
          "मी लाईव्ह प्रॉडक्ट्स शोधेन. थेट seller स्क्रीन उघडेल. कोणताही व्यवहार AIX करत नाही."
      },
      reply: wrapReply({
        message:
          "मी समजलो बॉस 👍\n₹300 मध्ये प्रॉडक्ट्स शोधू शकतो.\nआधी confirm करा – men, women की kids?\n\nपरिणाम: लाईव्ह items + थेट स्क्रीन. करू का?"
      })
    };
  }

  // Knowledge / discussion
  if (
    t.includes("माहिती") ||
    t.includes("future") ||
    t.includes("market") ||
    t.includes("घडामोड")
  ) {
    return {
      mode: "EXPLAIN",
      reply: wrapReply({
        message:
          "हा महत्वाचा विषय आहे बॉस. मी आधी समजावतो, मग पुढचं योग्य पाऊल सुचवतो."
      })
    };
  }

  // Default human advisor
  return {
    mode: "EXPLAIN",
    reply: wrapReply({
      message:
        "मी ऐकतोय बॉस. तुम्हाला माहिती हवी आहे, सल्ला हवा आहे की मी काही रियल करून दाखवू?"
    })
  };
}
