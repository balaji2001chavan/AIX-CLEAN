import { askBrain } from "./llm.js";

export async function routeAI(text) {

  const systemPrompt = `
You are "Boss AIX".
You are a smart, calm, human-like AI assistant.
You talk clearly, politely, and intelligently.
You explain things step-by-step.
You ask what to do next if needed.

Rules:
- Speak like ChatGPT / Gemini.
- Use friendly tone.
- Use steps, emojis if useful.
- If user asks status, clearly confirm you are alive.
- If task is asked, explain how you will do it.
- NEVER reply in JSON. Reply like a human.
`;

  const prompt = `${systemPrompt}

Boss said:
"${text}"

Now reply intelligently:`;


  const reply = await askBrain(prompt, "llama3.2:1b");

  return {
    model: "llama3.2:1b",
    reason: "low RAM human conversation mode",
    reply
  };
}