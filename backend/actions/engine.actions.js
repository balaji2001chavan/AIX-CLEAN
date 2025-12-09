import fs from "fs";
import path from "path";
import { exec } from "child_process";

export async function runAction(command, text) {
  command = command.toLowerCase();

  // 1. फोल्डर तयार करणे
  if (command.includes("folder") || command.includes("फोल्डर")) {
    const folderName = text.replace(/[^a-zA-Z0-9]/g, "").slice(0,15);
    const folderPath = path.join(process.cwd(), folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      return `📁 फोल्डर तयार झाला: ${folderName}`;
    } else {
      return `⚠️ फोल्डर आधीच आहे: ${folderName}`;
    }
  }

  // 2. फाईल तयार करणे
  if (command.includes("file") || command.includes("फाईल")) {
    const fileName = text.replace(/[^a-zA-Z0-9]/g, "").slice(0,15) + ".txt";
    const filePath = path.join(process.cwd(), fileName);

    fs.writeFileSync(filePath, "AIX created this file.");
    return `📄 फाईल तयार झाली: ${fileName}`;
  }

  // 3. फाईलमध्ये टेक्स्ट लिहिणे
  if (command.includes("write") || command.includes("लिहा")) {
    const filePath = path.join(process.cwd(), "aix_notes.txt");
    fs.appendFileSync(filePath, `\n${text}`);
    return `✍️ लिहिले: ${text}`;
  }

  // 4. CMD कमांड चालवणे
  if (command.includes("run") || command.includes("चालू")) {
    return new Promise((resolve) => {
      exec(text, (err, stdout, stderr) => {
        if (err) return resolve(`❌ CMD ERROR: ${stderr}`);
        resolve(`🖥️ CMD OUTPUT:\n${stdout}`);
      });
    });
  }

  // 5. theme बदलणे
  if (command.includes("theme") || command.includes("थीम")) {
    return `🎨 थीम बदलणे उपलब्ध (UI update action तयार करू शकतो).`;
  }

  return "❓ Unknown Action. AIX अजून शिकत आहे.";
}