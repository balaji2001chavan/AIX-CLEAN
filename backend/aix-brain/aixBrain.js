import { wrapReply } from "../core/persona/aixPersona.js";

export function aixBrain({ message }) {

  const lower = message.toLowerCase();

  // 1️⃣ Greeting
  if (
    lower.includes("hi") ||
    lower.includes("hello") ||
    lower.includes("नमस्कार") ||
    lower.includes("good")
  ) {
    return {
      type: "talk",
      reply: wrapReply({
        message: "आज काय करूया बॉस? खरेदी, बिझनेस की काही समजून घ्यायचं?"
      })
    };
  }

  // 2️⃣ Product intent
  if (lower.includes("₹") || lower.includes("कपडे") || lower.includes("product")) {
    return {
      type: "action",
      action: "PRODUCT_SEARCH"
    };
  }

  // 3️⃣ Default – deep talk
  return {
    type: "talk",
    reply: wrapReply({
      message:
        "मी समजतोय बॉस. तुम्ही जे विचारताय ते महत्वाचं आहे. थोडं खोलवर पाहूया."
    })
  };
}
