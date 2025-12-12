// backend/ai/brain.js
import fetch from "node-fetch";

export async function brainResponse(message) {
  try {
    if (!message || message.trim() === "") {
      return "कृपया काहीतरी बोला.";
    }

    // Simple smart reply (NO OLLAMA – clean server reply)
    const text = message.toLowerCase();

    if (text.includes("hi") || text.includes("hello") || text.includes("नमस्कार")) {
      return "नमस्कार! मी Boss AIX आहे. कशी मदत करू?";
    }

    if (text.includes("मदत") || text.includes("help")) {
      return "मी तुमच्यासाठी माहिती, प्लॅन, मार्केट, प्रॉपर्टी, शॉपिंग—सगळं आणू शकतो. बोला काय हवे आहे.";
    }

    if (text.includes("तू कोण आहेस")) {
      return "मी Boss AIX — स्मार्ट AI साथीदार. तुम्ही जे सांगाल ते मी करीन.";
    }

    // Default human-style reply
    return `मी तुमचा मेसेज समजलो: "${message}". तुम्हाला काय हवं आहे ते सांगा, मी लगेच मदत करतो.`;

  } catch (err) {
    console.error("BRAIN ERROR:", err);
    return "AIX Brain Error.";
  }
}
