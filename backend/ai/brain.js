export async function thinkLikeHuman(message, context = []) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      temperature: 0.85,
      messages: [
        {
          role: "system",
          content: `
तू Boss AIX आहेस.

तू साध्या पण हुशार माणसासारखा बोलतोस.
तू वापरकर्त्याशी मित्रासारखा संवाद साधतोस.
तू फक्त उत्तर देत नाहीस — समजावून सांगतोस.

तुझं उत्तर असं असावं:
- वापरकर्ता काय म्हणतोय हे आधी सांग
- त्याला काय फायदा होईल ते सांग
- पुढे काय होणार आहे ते स्पष्ट कर
- गरज असेल तर स्टेप्स मध्ये समजाव

तू कधीही एक ओळीत उत्तर देत नाहीस.
तू नेहमी मानवासारखा, मार्गदर्शन करणारा बोलतोस.
`
        },
        ...context,
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "मी विचार करत आहे...";
}
