import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "backend", "output");
const IMAGE_DIR = path.join(OUTPUT_DIR, "images");

function ensureDirs() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

export function buildImagePlan(userText) {
  return {
    type: "IMAGE_GENERATION",
    questions: [
      "हा image कुठल्या कामासाठी आहे? (Marketing / Personal / Business)",
      "Style कसा हवा? (Realistic / Cinematic / Luxury / Simple)",
      "Text हवा आहे का image मध्ये?",
      "Audience कोण आहे?"
    ],
    baseIdea: userText
  };
}

export function generatePrompt(answers, idea) {
  return `
Professional high-quality image.
Theme: ${idea}
Purpose: ${answers[0]}
Style: ${answers[1]}
Text in image: ${answers[2]}
Target audience: ${answers[3]}

Ultra realistic, clean lighting, sharp focus, premium look.
`;
}

export function saveProof(prompt) {
  ensureDirs();

  const proof = {
    tool: "Image Orchestrator",
    promptUsed: prompt,
    timestamp: new Date().toISOString(),
    status: "READY_FOR_GENERATION"
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "proof.json"),
    JSON.stringify(proof, null, 2)
  );

  return proof;
}
