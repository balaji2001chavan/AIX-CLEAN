import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function runAIX(userMessage) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are AIX, a smart autonomous AI assistant." },
      { role: "user", content: userMessage }
    ]
  });

  return response.choices[0].message.content;
}
