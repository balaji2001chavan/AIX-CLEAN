import fs from "fs";
import path from "path";

export async function generateRealImage(prompt) {
  const outDir = path.join(process.cwd(), "aix-output/images");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { wait_for_model: true }
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("HF RAW ERROR:", errText);
    throw new Error("Image generation failed from Hugging Face router");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const fileName = `real_image_${Date.now()}.png`;
  const filePath = path.join(outDir, fileName);

  fs.writeFileSync(filePath, buffer);
  return `/aix-output/images/${fileName}`;
}
