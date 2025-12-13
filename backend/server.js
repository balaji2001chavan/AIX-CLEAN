import express from "express";
import cors from "cors";
import path from "path";

import { parseCommand } from "./aix-core/core/command-engine/parseCommand.js";
import { getState, updateState } from "./aix-core/core/state-engine/stateManager.js";
import { createPlan } from "./aix-core/core/planner/planner.js";
import { autoSuggestNext } from "./aix-core/core/planner/autoSuggest.js";

import { createFile } from "./aix-core/executors/files/createFile.js";
import { takeScreenshot } from "./aix-core/executors/web/screenshot.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/aix-output", express.static(path.join(process.cwd(), "aix-output")));

app.get("/", (_, res) => res.send("AIX CORE LIVE"));

app.post("/api/aix", async (req, res) => {
  const command = parseCommand(req.body.message);
  const plan = createPlan(command);

  let result = "Planned only";

  if (command.goal.includes("HTML")) {
    createFile("demo.html", "<h1>Hello from AIX</h1>");
    updateState("HTML created");
    result = "HTML created";
  }

  if (command.goal.includes("screenshot")) {
    const img = await takeScreenshot("https://example.com");
    updateState("Screenshot taken");
    result = img;
  }

  res.json({ command, plan, result, state: getState() });
});

app.get("/api/aix/suggest", (_, res) => {
  res.json(autoSuggestNext(getState()));
});

app.post("/api/aix/approve", async (req, res) => {
  const { action } = req.body;
  let r = "No action";

  if (action === "create_html") {
    createFile("auto.html", "<h1>Auto AIX</h1>");
    updateState("HTML auto created");
    r = "HTML auto created";
  }

  if (action === "take_screenshot") {
    r = await takeScreenshot("https://example.com");
    updateState("Screenshot auto taken");
  }

  res.json({ result: r, state: getState() });
});

app.listen(10000, () => console.log("AIX running"));
