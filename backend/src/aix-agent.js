import fetch from "node-fetch";

/* ===== AI CALL ===== */
async function callOpenAI(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "तू AIX आहेस. मराठीत, माणसासारखा बोल." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "मी उत्तर देऊ शकलो नाही 😔";
}

/* ===== MAIN AGENT ===== */
export async function runAgent(message) {

  // basic command detection (future auto-agent base)
  if (message.toLowerCase().includes("restart backend")) {
    return "⚙️ Backend restart करण्यासाठी परवानगी लागेल";
  }

  // AI reply
  const aiReply = await callOpenAI(message);
  return aiReply;
}
