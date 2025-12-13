import fs from "fs";
import path from "path";

const BASE_DIR = "/data";

export function writeCodeFile(filename, code) {
  if (!filename || !code) {
    throw new Error("Filename or code missing");
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(BASE_DIR, safeName);

  fs.writeFileSync(filePath, code, "utf8");

  return {
    success: true,
    path: filePath,
    lines: code.split("\n").length
  }; 
}
