// aix/ollama.js
const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3.2:latest";

export async function askAI(prompt) {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: prompt,
      stream: false
    })
  });

  if (!res.ok) {
    throw new Error("Ollama HTTP error");
  }

  const data = await res.json();
  return data.response;
}