import fetch from "node-fetch";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function askAI(prompt) {
  if (!GROQ_API_KEY) throw new Error("Missing API KEY");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are AIX. Real intelligent assistant. Execute tasks and answer in Marathi and English."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No reply from AI";
}
