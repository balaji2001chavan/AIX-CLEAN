export function contentAction(command) {
  return {
    executed: true,
    type: "CONTENT",
    result: `तुमच्या goal नुसार कंटेंट तयार केला आहे:
- विषय: ${command.goal}
- पुढील स्टेप: पोस्ट करा, शेअर करा, सुधारणा करा`
  };
}
