import fs from "fs";
import path from "path";

export function createFile(filePath, content = "") {
  const fullPath = path.resolve(process.cwd(), filePath);

  // If folder path doesn't exist, create directories
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  // Write new file
  fs.writeFileSync(fullPath, content, "utf-8");

  return {
    status: "success",
    message: "File created",
    path: fullPath
  };
}

export function updateFile(filePath, newContent) {
  const fullPath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    return {
      status: "error",
      message: "File not found",
      path: fullPath
    };
  }

  fs.writeFileSync(fullPath, newContent, "utf-8");

  return {
    status: "success",
    message: "File updated",
    path: fullPath
  };
}

export function appendFile(filePath, content) {
  const fullPath = path.resolve(process.cwd(), filePath);

  fs.appendFileSync(fullPath, content, "utf-8");

  return {
    status: "success",
    message: "Content appended",
    path: fullPath
  };
}
