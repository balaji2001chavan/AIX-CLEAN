import { chromium } from "playwright";
import fs from "fs";
import path from "path";

export async function takeScreenshot(url) {
  const dir = path.join(process.cwd(), "aix-output");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const file = path.join(dir, "screenshot.png");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: file });
  await browser.close();

  return "/aix-output/screenshot.png";
}
