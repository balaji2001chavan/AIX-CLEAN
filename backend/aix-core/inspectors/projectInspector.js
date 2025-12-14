import fs from "fs";
import path from "path";

export function inspectProject(root = process.cwd()) {
  const findings = [];

  // package.json तपास
  const pkgPath = path.join(root, "package.json");
  if (!fs.existsSync(pkgPath)) {
    findings.push({
      type: "error",
      code: "PKG_MISSING",
      message: "package.json नाही",
      fix: "package.json तयार करा"
    });
  }

  // server.js तपास
  const serverPath = path.join(root, "server.js");
  if (!fs.existsSync(serverPath)) {
    findings.push({
      type: "error",
      code: "SERVER_MISSING",
      message: "server.js नाही",
      fix: "server.js तयार करा"
    });
  }

  // aix-output तपास
  const outDir = path.join(root, "aix-output");
  if (!fs.existsSync(outDir)) {
    findings.push({
      type: "info",
      code: "OUTPUT_DIR_MISSING",
      message: "aix-output फोल्डर नाही",
      fix: "aix-output फोल्डर तयार करा"
    });
  }

  return {
    summary: `${findings.length} समस्या सापडल्या`,
    findings
  };
}
