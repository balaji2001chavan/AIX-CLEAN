// emotion-detector.js
// साधा heuristic sentiment/emotion detector — future मध्ये ML मॉडलने replace करावा.

export function detectEmotion(text) {
  const t = text.toLowerCase();

  const joyWords = ["आनंदी","खुश","आनंद","छान","great","awesome","happy","😍","😊"];
  const sadWords = ["दु:ख","खुंज","खेड","alone","sad","unhappy","🥺","😢"];
  const angryWords = ["राग","झाव","नको","angry","furious","😡"];
  const fearWords = ["भीती","भिती","डर","scared","worried"];
  const trustWords = ["ठेव","विश्वास","trust","confident","👍"];
  const surpriseWords = ["विष्मित","shocked","wow","OMG","अप्रत"];

  function containsAny(arr){
    return arr.some(w => t.includes(w));
  }

  if (containsAny(joyWords)) return "joy";
  if (containsAny(angryWords)) return "anger";
  if (containsAny(sadWords)) return "sadness";
  if (containsAny(fearWords)) return "fear";
  if (containsAny(surpriseWords)) return "surprise";
  if (containsAny(trustWords)) return "trust";

  // default neutral
  return "neutral";
}
