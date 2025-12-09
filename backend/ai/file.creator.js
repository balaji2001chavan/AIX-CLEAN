// file.creator.js
// SAFE FILE CREATION ENGINE (International-level automation)

import fs from "fs";
import path from "path";

export function createFileInProject({ projectPath, fileName, content }) {
  try {
    if (!projectPath || !fileName) {
      return {
        ok: false,
        message: "Missing projectPath or fileName."
      };
    }

    const fullPath = path.join(projectPath, fileName);

    // Ensure folder exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(fullPath, content, "utf8");

    return {
      ok: true,
      message: `File created successfully: ${fullPath}`
    };
  } catch (err) {
    return {
      ok: false,
      message: `Error creating file: ${err.message}`
    };
  }
}
