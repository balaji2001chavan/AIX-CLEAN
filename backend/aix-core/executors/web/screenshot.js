import { chromium } from "playwright";
import fs from "fs";
import path from "path";

export async function takeScreenshot(url) {
  const outDir = path.join(process.cwd(), "aix-output");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const filePath = path.join(outDir, "screenshot.png");

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.screenshot({ path: filePath, fullPage: true });
  await browser.close();

  return filePath;
}
