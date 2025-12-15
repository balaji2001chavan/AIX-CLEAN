import { wrapReply } from "../core/persona/aixPersona.js";

export function aixBrain({ message }) {
  const text = message.toLowerCase();

  // 1️⃣ Feeling / vague talk
  if (
    text.includes("समजत") ||
    text.includes("काय करायचं") ||
    text.includes("help") ||
    text.includes("अडचण")
  ) {
    return {
      type: "talk",
      reply: wrapReply({
        message:
          "मी समजतोय बॉस. थोडं स्पष्ट सांगाल का – तुम्हाला माहिती हवी आहे की काही काम करून दाखवू?"
      })
    };
  }

  // 2️⃣ Knowledge / discussion
  if (
    text.includes("माहिती") ||
    text.includes("कसं") ||
    text.includes("का")
  ) {
    return {
      type: "talk",
      reply: wrapReply({
        message:
          "छान प्रश्न आहे बॉस. आधी थोडं समजावतो, मग पुढचं पाऊल ठरवू."
      })
    };
  }

  // 3️⃣ Clear product intent
  if (
    text.includes("₹") ||
    text.includes("कपडे") ||
    text.includes("घेणे")
  ) {
    return {
      type: "clarify",
      reply: wrapReply({
        message:
          "बरं बॉस 👍 हे पाहण्याआधी एक गोष्ट सांगा – men, women की kids साठी?"
      })
    };
  }

  // 4️⃣ Default – conversational
  return {
    type: "talk",
    reply: wrapReply({
      message:
        "मी ऐकतोय बॉस. थोडं अजून सांगा म्हणजे मी योग्य उत्तर देऊ शकेन."
    })
  };
}
