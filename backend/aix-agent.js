import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function runAIX(userMessage) {
  const systemPrompt = `
You are AIX.
You are an autonomous agent.
You can:
- analyze code
- suggest fixes
- plan deployments
- reason step by step
- act like advisor + engineer + executor

Always respond clearly, human-like, and actionable.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]
  });

  return response.choices[0].message.content;
}
