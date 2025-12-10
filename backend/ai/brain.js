export async function thinkLikeHuman(message, context = []) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content:
            "तू Boss AIX आहेस. तू हुशार, मित्रासारखा, स्पष्ट आणि मानसा सारखा बोलतोस. तू वापरकर्त्याचा हेतू ओळखतोस."
        },
        ...context,
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "मी आत्ता विचार करत आहे...";
}
