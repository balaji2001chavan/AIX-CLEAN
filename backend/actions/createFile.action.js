import fs from "fs";
import path from "path";

export function createFileAction({ filename, content }) {
  const outputDir = path.join(process.cwd(), "output");

  // ensure output folder
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, filename);

  fs.writeFileSync(
    filePath,
    content || "AIX generated this file successfully.",
    "utf8"
  );

  return {
    success: true,
    file: filename,
    path: `/output/${filename}`
  };
}
