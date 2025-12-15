export function apxThink(message) {
  let intent = "general";

  if (message.includes("सेल") || message.includes("sell")) intent = "sales";
  if (message.includes("मार्केटिंग")) intent = "marketing";
  if (message.includes("image") || message.includes("इमेज")) intent = "image";

  return {
    intent,
    summary: `AIX ला "${intent}" विषय समजला आहे`
  };
}
