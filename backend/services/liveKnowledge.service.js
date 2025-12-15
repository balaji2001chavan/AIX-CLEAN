export async function getLiveKnowledge(topic) {
  // Phase-1: curated reasoning (no hallucination)
  const summaries = {
    ai: "AI adoption India मध्ये वाढतेय; education, automation, startups मध्ये संधी.",
    market: "Demand sector-wise बदलतो; seasonality आणि pricing महत्वाचे."
  };
  return summaries[topic] || "हा विषय general reasoning वर सांगतो; live verify करू का?";
}
