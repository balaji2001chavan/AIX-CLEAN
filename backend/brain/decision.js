export function decisionEngine(reasoning) {
  let suggestion = "साधं उत्तर देण्यात येईल";

  if (reasoning.intent === "BUY_DECISION") {
    suggestion = "खरेदीपूर्वी बाजार, बजेट आणि धोका तपासा";
  }

  if (reasoning.intent === "SELL_DECISION") {
    suggestion = "विक्रीसाठी योग्य वेळ आणि किंमत तपासा";
  }

  if (reasoning.intent === "COMMAND") {
    suggestion = "काम करण्यासाठी पुढील स्टेप्स सुचवतो";
  }

  return {
    suggestion,
    reasoning
  };
}
