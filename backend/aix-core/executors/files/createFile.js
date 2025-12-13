import fs from "fs";
import path from "path";

export function createFile(name, content) {
  const dir = path.join(process.cwd(), "aix-output");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const p = path.join(dir, name);
  fs.writeFileSync(p, content);
  return p;
}
