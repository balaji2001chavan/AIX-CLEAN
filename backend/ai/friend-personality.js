// friend-personality.js
// छोटा helper — persona बनवतो: friendly, respectful replies with warmth.
// input: { language, emotion, intent, rawText }
// output: { voiceReply, styleTag }

export function buildPersonalityReply({ language, emotion, intent, rawText, baseResponse }) {
  // baseResponse = engine's neutral response (string)
  // We'll craft a friendly wrapper in same language (basic)
  let prefix = "";
  let suffix = "";

  // simple multilingual prefixes (can be expanded)
  if (language === "marathi") {
    prefix = "मित्रा,";
    suffix = "आणि अजून हवे असल्यास सांग.";
  } else if (language === "hindi") {
    prefix = "दोस्त,";
    suffix = "और कुछ चाहिए तो बताओ.";
  } else { // default english
    prefix = "Hey friend,";
    suffix = "Tell me if you want changes.";
  }

  // emotion-based warmth
  if (emotion === "joy") {
    prefix = prefix + " 😊 ";
  } else if (emotion === "anger") {
    prefix = prefix + " ⚠️ ";
  } else if (emotion === "sadness") {
    prefix = prefix + " 😔 ";
  }

  // style: more elaborate for 'super' voice
  const voiceReply = `${prefix} ${baseResponse} ${suffix}`;

  // styleTag helps UI pick color/tone
  const styleTag = {
    tone: emotion === "neutral" ? "calm" : emotion,
    friendliness: 9
  };

  return { voiceReply, styleTag };
}
