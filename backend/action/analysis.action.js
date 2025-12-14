export function analysisAction(command) {
  return {
    executed: true,
    type: "ANALYSIS",
    result: `विश्लेषण:
- Goal: ${command.goal}
- Context: ${command.context || "General"}
- सल्ला: निर्णय घेण्याआधी धोका व बजेट तपासा`
  };
}
