import fs from "fs";
import path from "path";

export function createFile(filename, content) {
  const outputDir = path.join(process.cwd(), "aix-output");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, content, "utf-8");

  return filePath;
}
