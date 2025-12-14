import express from "express";
import cors from "cors";
import path from "path";

// CORE
import { parseCommand } from "./aix-core/core/command-engine/parseCommand.js";
import { getState, updateState } from "./aix-core/core/state-engine/stateManager.js";
import { createPlan } from "./aix-core/core/planner/planner.js";
import { autoSuggestNext } from "./aix-core/core/planner/autoSuggest.js";

// EXECUTORS
import { createFile } from "./aix-core/executors/files/createFile.js";
import { takeScreenshot } from "./aix-core/executors/web/screenshot.js";
import { searchKnowledge } from "./aix-core/executors/knowledge/searchKnowledge.js";

const app = express();
app.use(cors());
app.use(express.json());

// serve output files
app.use("/aix-output", express.static(path.join(process.cwd(), "aix-output")));

// health
app.get("/", (req, res) => {
  res.send("AIX CORE LIVE");
});

// ========== MAIN AIX API ==========
app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body.message || "";

    // 1. parse
    const command = parseCommand(message);

    // 2. plan
    const plan = createPlan(command);

    // default response
    let result = "No execution";
    let extra = {};

    // ========== KNOWLEDGE ==========
    if (
      command.goal.toLowerCase().includes("भविष्य") ||
      command.goal.toLowerCase().includes("knowledge") ||
      command.goal.toLowerCase().includes("information")
    ) {
      const data = await searchKnowledge(command.goal);
      updateState("Knowledge searched");

      return res.json({
        command,
        plan,
        result: data.summary,
        sources: data.sources,
        state: getState()
      });
    }

    // ========== HTML FILE ==========
    if (command.goal.toLowerCase().includes("html")) {
      const filePath = createFile(
        "demo.html",
        "<h1>Hello from AIX</h1><p>HTML created</p>"
      );
      updateState("HTML created");
      result = `HTML created at ${filePath}`;
    }

    // ========== SCREENSHOT ==========
    if (command.goal.toLowerCase().includes("screenshot")) {
  const targetUrl = command.url || "https://example.com";
  const imgUrl = await takeScreenshot(targetUrl);
  updateState("Screenshot taken");
  return res.json({
    command,
    plan,
    result: "Screenshot taken",
    imageUrl: imgUrl,
    state: getState()
   });
 }
    // FINAL RESPONSE
    res.json({
      command,
      plan,
      result,
      ...extra,
      state: getState()
    });

  } catch (err) {
    console.error("AIX ERROR:", err);
    res.status(500).json({
      error: "AIX internal error",
      details: err.message
    });
  }
});

// ========== AUTO SUGGEST ==========
app.get("/api/aix/suggest", (req, res) => {
  const suggestion = autoSuggestNext(getState());
  res.json({ suggestion, state: getState() });
});

// ========== APPROVAL ==========
app.post("/api/aix/approve", async (req, res) => {
  try {
    const { action } = req.body;
    let result = "No action executed";

    if (action === "create_html") {
      createFile("auto.html", "<h1>Auto HTML by AIX</h1>");
      updateState("HTML auto created");
      result = "HTML auto created";
    }

    if (action === "take_screenshot") {
      const img = await takeScreenshot("https://example.com");
      updateState("Screenshot auto taken");
      result = img;
    }

    res.json({ result, state: getState() });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AIX running on port", PORT);
});
