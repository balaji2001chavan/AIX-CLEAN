import fs from "fs";
import path from "path";

export function applyFix(code) {
  if (code === "OUTPUT_DIR_MISSING") {
    const dir = path.join(process.cwd(), "aix-output");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      return "aix-output फोल्डर तयार केला";
    }
    return "aix-output आधीच आहे";
  }

  return "हा fix ऑटोमॅटिक नाही";
}
