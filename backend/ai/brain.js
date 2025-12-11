import fetch from "node-fetch";

export async function brainResponse(text) {
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are Boss AIX. Speak naturally, human-like, smart." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await r.json();
    return data?.choices?.[0]?.message?.content || "AIX ERROR: Empty response";

  } catch (err) {
    console.error("BRAIN ERROR:", err);
    return "AIX ERROR: Brain failed.";
  }
}
