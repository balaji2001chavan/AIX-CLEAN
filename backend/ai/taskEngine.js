import fs from "fs";
import path from "path";

export async function runTask(task, userId = "default") {
  const t = (task || "").toLowerCase();
  if (t.includes("build") && t.includes("app")) {
    // stub response — you can expand to actually scaffold projects
    const stamp = Date.now();
    const folder = path.join(process.cwd(), "generated_apps", `${stamp}_app`);
    try {
      fs.mkdirSync(folder, { recursive: true });
      // create a basic README and index.html (example)
      fs.writeFileSync(path.join(folder, "README.md"), `# Generated App ${stamp}\nBy AIX for ${userId}`);
      fs.writeFileSync(path.join(folder, "index.html"), `<html><body><h1>Generated App - ${stamp}</h1></body></html>`);
      return `AIX: App scaffolded at /generated_apps/${stamp}_app — check the folder.`;
    } catch (e) {
      return `AIX: Failed to create app: ${e.message}`;
    }
  }

  if (t.includes("marketing")) {
    return `AIX: Marketing plan generated — 1) 30s video script, 2) 5 social captions, 3) campaign schedule. Ask "show marketing" to see details.`;
  }

  if (t.includes("property") || t.includes("leads")) {
    return `AIX: Property lead module: To fetch live leads, connect property APIs. For test: sample leads -> 3 mock leads prepared. Ask "get leads"`;
  }

  if (t.includes("shopping")) {
    return `AIX: Shopping module ready. To search live products we need APIs/affiliate keys. For now I can return mock product options.`;
  }

  return `AIX: Task engine heard: "${task}". I can: build app, run marketing, fetch leads, shopping. Tell me exact task.`;
}