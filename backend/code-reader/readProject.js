import fs from "fs";
import path from "path";

const IGNORE = ["node_modules", ".git", "dist", "build"];

function readDir(dir, depth = 0) {
  if (depth > 4) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let result = [];

  for (const e of entries) {
    if (IGNORE.includes(e.name)) continue;

    const fullPath = path.join(dir, e.name);

    if (e.isDirectory()) {
      result.push({
        type: "folder",
        name: e.name,
        children: readDir(fullPath, depth + 1)
      });
    } else if (e.isFile()) {
      result.push({
        type: "file",
        name: e.name
      });
    }
  }
  return result;
}

export function readProject(rootPath) {
  return {
    scannedAt: new Date().toISOString(),
    structure: readDir(rootPath)
  };
}
