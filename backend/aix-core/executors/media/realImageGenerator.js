import fs from "fs";
import path from "path";

export async function generateRealImage(prompt) {
  const outDir = path.join(process.cwd(), "aix-output/images");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const res = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    }
  );

  if (!res.ok) {
    throw new Error("Image generation failed");
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const fileName = `real_image_${Date.now()}.png`;
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, buffer);

  return `/aix-output/images/${fileName}`;
}
