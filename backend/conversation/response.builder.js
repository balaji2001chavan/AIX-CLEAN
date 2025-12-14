export function buildConversationalResponse({ input, intent, decision, execution }) {
  let response = "";

  response += "ठीक आहे, आपण हे नीट समजून घेऊया.\n\n";

  if (intent === "QUESTION") {
    response += "तुमचा प्रश्न महत्त्वाचा आहे.\n\n";
  }

  if (decision) {
    response += "माझ्या समजुतीनुसार:\n";
    response += "- " + decision + "\n\n";
  }

  if (execution?.executed) {
    response += "मी आत्ता हे काम केलं आहे:\n";
    response += execution.result + "\n\n";
  } else {
    response += "सध्या मी फक्त सल्ला देतोय, प्रत्यक्ष action पुढच्या टप्प्यात होईल.\n\n";
  }

  response += "जर तुम्हाला हवं असेल तर आपण यावर पुढे सविस्तर बोलू शकतो.";

  return response;
}
