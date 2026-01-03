import fs from "fs";

export default async function fileTool(msg) {
  const content = `AIX created this file from command:\n${msg}`;
  const path = `./output/aix_${Date.now()}.txt`;

  fs.writeFileSync(path, content);

  return {
    reply: "📁 File created successfully",
    file: path,
    action: "FILE_CREATE"
  };
}
