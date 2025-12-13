import fs from "fs";
import path from "path";

const BASE_DIR = "/data"; // Render persistent storage

export function createFile(filename, content = "") {
  if (!filename) throw new Error("Filename missing");

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(BASE_DIR, safeName);

  fs.writeFileSync(filePath, content, "utf8");

  return {
    success: true,
    path: filePath,
    size: content.length
  };
}
