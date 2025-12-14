export function ethicsCheck(decision) {
  const blockedWords = ["फसवणूक", "fraud", "illegal"];

  for (let word of blockedWords) {
    if (decision.reasoning.input.toLowerCase().includes(word)) {
      return {
        allowed: false,
        finalResponse: "हे काम नैतिक किंवा कायदेशीर नाही"
      };
    }
  }

  return {
    allowed: true,
    finalResponse: decision.suggestion
  };
}
