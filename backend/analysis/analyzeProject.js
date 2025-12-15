import fs from "fs";
import path from "path";

const IGNORE = ["node_modules", ".git", "dist", "build", "output"];

function scan(dir, depth = 0) {
  if (depth > 4) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let result = [];

  for (const e of entries) {
    if (IGNORE.includes(e.name)) continue;

    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      result.push({
        type: "folder",
        name: e.name,
        children: scan(full, depth + 1)
      });
    } else {
      result.push({
        type: "file",
        name: e.name,
        size: fs.statSync(full).size
      });
    }
  }
  return result;
}

export function analyzeProject(root = process.cwd()) {
  const structure = scan(root);

  // Very simple intelligence (phase 1)
  let insights = [];

  const fileCount = JSON.stringify(structure).match(/"type":"file"/g)?.length || 0;
  const folderCount = JSON.stringify(structure).match(/"type":"folder"/g)?.length || 0;

  if (fileCount > 20) {
    insights.push(
      "प्रोजेक्टमध्ये फाईल्स खूप आहेत. modules मध्ये वेगळं केल्यास maintain करणे सोपं होईल."
    );
  }

  if (folderCount < 3) {
    insights.push(
      "सर्व logic एका ठिकाणी असल्याची शक्यता आहे. controllers / services वेगळे करता येतील."
    );
  }

  insights.push(
    "पुढच्या स्टेपमध्ये मी duplicate code, unused files आणि risk points शोधू शकतो."
  );

  return {
    scannedAt: new Date().toISOString(),
    summary: {
      files: fileCount,
      folders: folderCount
    },
    insights,
    structure
  };
}
