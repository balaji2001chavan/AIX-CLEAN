import fetch from "node-fetch";

export async function runBrain(message) {
  try {
    const prompt = `You are Boss AIX. Talk like a smart, friendly assistant. 
    User said: "${message}". Give a clear helpful reply.`;

    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await resp.json();
    return data.choices?.[0]?.message?.content || "मला नीट समजलं नाही.";
  }
  catch (err) {
    console.error("BRAIN ERROR:", err);
    return "AIX ERROR: Brain issue.";
  }
}
