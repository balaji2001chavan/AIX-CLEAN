export function helpAction(command) {
  return {
    executed: true,
    type: "GUIDE",
    result: `मी तुमचा आदेश समजलो आहे.
कृपया स्पष्ट goal सांगा जसे:
- कंटेंट तयार कर
- विश्लेषण कर
- पुढील स्टेप सुचव`
  };
}
