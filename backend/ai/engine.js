import fetch from "node-fetch";

export async function runAIX(prompt) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!data?.choices) return "⚠️ Engine error.";

    return data.choices[0].message.content;
  } catch (err) {
    console.error("Groq Engine Error:", err);
    return "🔥 AI Engine failed to generate response.";
  }
}