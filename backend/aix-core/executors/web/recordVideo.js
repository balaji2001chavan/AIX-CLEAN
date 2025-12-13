import { chromium } from "playwright";
import fs from "fs";
import path from "path";

export async function recordVideo(url) {
  const outDir = path.join(process.cwd(), "aix-output");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const videoDir = path.join(outDir, "videos");
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir);

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const context = await browser.newContext({
    recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } }
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(5000); // 5 sec demo

  await context.close();
  await browser.close();

  // Return latest video file
  const files = fs.readdirSync(videoDir).filter(f => f.endsWith(".webm"));
  const latest = files.sort((a, b) =>
    fs.statSync(path.join(videoDir, b)).mtimeMs -
    fs.statSync(path.join(videoDir, a)).mtimeMs
  )[0];

  return `/aix-output/videos/${latest}`;
}
