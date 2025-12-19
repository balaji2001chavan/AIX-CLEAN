import fs from "fs";
import path from "path";

export function createFile(filename, content) {
  try {
    const outputDir = path.join(process.cwd(), "backend", "output");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, filename);

    fs.writeFileSync(filePath, content, "utf8");

    return {
      success: true,
      file: filename,
      path: `/backend/output/${filename}`
    };

  } catch (error) {
    return {
      success: false,
      message: `File creation failed: ${error.message}`
    };
  }
}
