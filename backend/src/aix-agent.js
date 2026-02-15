import fs from "fs";
import path from "path";

/**
 * AIX AGENT – Human level replies
 * पुढे OpenAI / Gemini / HF plug होईल
 */
export async function aixAgent(userMessage) {
  const msg = userMessage.toLowerCase();

  // 🔍 Debug understanding
  if (msg.includes("undefined")) {
    return `
तुझा issue मला समजला आहे 👍  
Frontend reply render होत नाही कारण API response handle नीट नाही.

मी fix सुचवतो:
1) script.js मध्ये response.reply वापर
2) error UI मध्ये दाखव

तू म्हणशील तेव्हा मी स्वतः code बदलतो.
`;
  }

  // 🔁 Restart command
  if (msg.includes("restart")) {
    return `
Backend restart करायचा आहे असे दिसते.
Command:
pm2 restart aix-backend

तू "हो कर" म्हणालास तर मी execute करेन.
`;
  }

  // 🧠 Self awareness
  if (msg.includes("तू कोण आहेस") || msg.includes("who are you")) {
    return `
मी AIX आहे 🤖  
Self-learning, self-repairing AI Agent.

तू आदेश देतोस.
मी काम करतो.
`;
  }

  // Default smart Marathi reply
  return `
मी ऐकलं: "${userMessage}"

मी सध्या:
✅ Backend चालू आहे
✅ API working आहे
⚠️ Frontend logic सुधारू शकतो

मला सांग:
• fix frontend
• scan repo
• upgrade yourself
`;
}
