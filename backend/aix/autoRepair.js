// aix/autoRepair.js
import fs from "fs";
import path from "path";
import { storeExperience } from "./memory.js";

const BASE_DIR = "C:/Users/HP/BOSS_AIX_OS/backend";

export function applyFix(fix) {
  if (!fix || !fix.action) {
    throw new Error("INVALID FIX FORMAT");
  }

  if (fix.action === "WRITE_FILE") {
    const fullPath = path.join(BASE_DIR, fix.path);

    // 🔐 Security guard
    if (!fullPath.startsWith(BASE_DIR)) {
      throw new Error("SECURITY BLOCK: Path escape attempt");
    }

    // 📁 folder create
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    // 🔄 backup if exists
    if (fs.existsSync(fullPath)) {
      fs.copyFileSync(fullPath, fullPath + ".bak");
    }

    // ✍️ write file
    fs.writeFileSync(fullPath, fix.content, "utf8");

    // 🧠 MEMORY SAVE (हेच STEP–2 चं heart आहे)
    storeExperience(
      new Error("FILE_WRITE_FIX"),
      fix
    );

    return {
      status: "FIX_APPLIED",
      file: fullPath
    };
  }

  throw new Error("UNKNOWN FIX ACTION");
}