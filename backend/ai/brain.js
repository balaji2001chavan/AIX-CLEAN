// backend/ai/brain.js
import fetch from "node-fetch";

export async function brainResponse(message) {
  try {
    // Safety: रिकामा मेसेज आला तर
    if (!message || message.trim() === "") {
      return "मी ऐकतोय… बोला.";
    }

    // GROQ किंवा GPT-सारखा कॉल
    const groqKey = process.env.GROQ_API_KEY;

    const body = {
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are Boss AIX: एक अत्यंत बुद्धिमान, मानवासारखा, autonomous AI OS. तू प्रत्येक गोष्ट समजतोस, plan करतोस, आणि user साठी रिअल कामे करतोस." },
        { role: "user", content: message }
      ]
    };

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const json = await res.json();

    return json?.choices?.[0]?.message?.content || "मी विचार करत आहे…";
  }

  catch (e) {
    return "AIX ERROR: Brain compute समस्या.";
  }
}
