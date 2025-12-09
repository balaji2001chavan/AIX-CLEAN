// C:\Users\HP\BOSS_AIX_OS\backend\ai\agent.browser.js
import puppeteer from "puppeteer";

const LAUNCH_OPTS = {
  headless: true, // dev साठी false करुन विंडो बघता येईल
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
};

// basic helper: launch browser, run fn, close
async function withBrowser(fn) {
  const browser = await puppeteer.launch(LAUNCH_OPTS);
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    return await fn(page, browser);
  } finally {
    await browser.close();
  }
}

/**
 * searchWeb(query)
 * - Google search (serp) top results: returns array {title, snippet, url}
 */
export async function searchWeb(query, maxResults = 5) {
  return withBrowser(async (page) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}&hl=en`;
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    // accept cookie banner if present (best-effort)
    try {
      await page.evaluate(() => {
        const b = document.querySelector('button[aria-label*="Accept"]') ||
                  document.querySelector('button[aria-label*="agree"]') ||
                  document.querySelector('#L2AGLb');
        if (b) b.click();
      });
    } catch (e) {}

    // Wait for results
    await page.waitForSelector("div#search", { timeout: 8000 });

    const results = await page.evaluate((maxResults) => {
      const nodes = Array.from(document.querySelectorAll("div#search .g"));
      const out = [];
      for (let i = 0; i < Math.min(nodes.length, maxResults); i++) {
        const n = nodes[i];
        const a = n.querySelector("a");
        const titleEl = n.querySelector("h3");
        const snippetEl = n.querySelector(".VwiC3b") || n.querySelector(".IsZvec");
        if (a && titleEl) {
          out.push({
            title: titleEl.innerText || "",
            snippet: snippetEl ? snippetEl.innerText : "",
            url: a.href
          });
        }
      }
      return out;
    }, maxResults);

    return results;
  });
}

/**
 * getPropertyLeads(query)
 * - Best-effort: run a site-limited Google search (site:magicbricks OR site:99acres etc.)
 * - returns top links/snippets; a starting point for scraping specific listing pages.
 */
export async function getPropertyLeads(locationQuery, maxResults = 8) {
  // search common property portals via Google
  const portalQuery =
    `${locationQuery} site:magicbricks.com OR site:99acres.com OR site:makaan.com OR site:housing.com`;
  const results = await searchWeb(portalQuery, maxResults);
  return results;
}

/**
 * quickScreenshot(url) -> returns base64 screenshot (small preview)
 */
export async function quickScreenshot(url, width = 1200, height = 800) {
  return withBrowser(async (page) => {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page.setViewport({ width, height });
    const buf = await page.screenshot({ fullPage: false });
    return buf.toString("base64");
  });
}

/**
 * fetchPageText(url) -> grabs visible text from page (useful to summarize)
 */
export async function fetchPageText(url) {
  return withBrowser(async (page) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    // remove scripts/styles then return innerText
    const txt = await page.evaluate(() => {
      const bad = Array.from(document.querySelectorAll("script, style, noscript, svg"));
      bad.forEach(n => n.remove());
      return document.body.innerText.slice(0, 20000); // limit
    });
    return txt;
  });
}

// Export a simple "doTask" that routes commands
export async function doTask(command, args = {}) {
  const cmd = (command || "").toLowerCase();

  if (cmd.startsWith("search:")) {
    const q = command.slice("search:".length).trim();
    return { type: "search", results: await searchWeb(q, args.max || 5) };
  }

  if (cmd.startsWith("property:")) {
    const q = command.slice("property:".length).trim();
    return { type: "property", results: await getPropertyLeads(q, args.max || 8) };
  }

  if (cmd.startsWith("screenshot:")) {
    const url = command.slice("screenshot:".length).trim();
    const b64 = await quickScreenshot(url);
    return { type: "screenshot", data: b64 };
  }

  if (cmd.startsWith("fetch:")) {
    const url = command.slice("fetch:".length).trim();
    const text = await fetchPageText(url);
    return { type: "fetch", text };
  }

  return { type: "error", message: "Unknown command for agent.browser" };
}