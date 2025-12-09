  // aix/executor.js
import fs from "fs";
import path from "path";

// 🚧 AI फक्त या फोल्डरमध्येच काम करू शकतो
const BASE_DIR = "C:/Users/HP/BOSS_AIX_OS/backend";

export function safeWriteFile(relativePath, content) {
  const fullPath = path.join(BASE_DIR, relativePath);

  // 🔒 Guard: बाहेर जाणार नाही
  if (!fullPath.startsWith(BASE_DIR)) {
    throw new Error("SECURITY BLOCK: Invalid path");
  }

  // 🔄 Backup if file exists
  if (fs.existsSync(fullPath)) {
    fs.copyFileSync(fullPath, fullPath + ".bak");
  }

  // 📁 Folder create if needed
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  // ✍️ Write file
  fs.writeFileSync(fullPath, content, "utf8");

  return {
    status: "SUCCESS",
    file: fullPath
  };
}