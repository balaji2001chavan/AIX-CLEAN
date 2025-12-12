import fetch from "node-fetch";

export async function brainResponse(userMessage) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return "❌ Missing GROQ API Key.";

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are Boss AIX — a highly intelligent AI who speaks like a human, understands intention, gives real information, plans actions, and talks naturally like ChatGPT, Meta AI, and Gemini. Always reply smart, emotional, helpful, and deeply knowledgeable."
      },
      {
        role: "user",
        content: userMessage,
      },
    ]
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "⚠️ I could not generate a reply.";
}
