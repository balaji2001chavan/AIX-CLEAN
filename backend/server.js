import express from "express";
import cors from "cors";
import path from "path";

// AIX CORE
import { parseCommand } from "./aix-core/core/command-engine/parseCommand.js";
import { getState, updateState } from "./aix-core/core/state-engine/stateManager.js";
import { createPlan } from "./aix-core/core/planner/planner.js";

// EXECUTORS
import { createFile } from "./aix-core/executors/files/createFile.js";
import { takeScreenshot } from "./aix-core/executors/web/screenshot.js";

const app = express();
app.use(cors());
app.use(express.json());

// 👉 Serve AIX output (screenshots, files)
app.use(
  "/aix-output",
  express.static(path.join(process.cwd(), "aix-output")) 
);

// HEALTH
app.get("/", (req, res) => {
  res.send("AIX CORE IS LIVE");
});

// TEST
app.get("/api/aix", (req, res) => {
  res.json({ status: "AIX API reachable" });
});

// MAIN AIX API
app.post("/api/aix", async (req, res) => {
  try {
    const { message } = req.body;

    const command = parseCommand(message);
    const state = getState();
    const plan = createPlan(command, state);

    let result = "Only planning done";
    let imageUrl = null;

    // FILE EXECUTOR
    if (
      command.goal.toLowerCase().includes("html") &&
      command.output.toLowerCase().includes("html")
    ) {
      const html = `
<!DOCTYPE html>
<html>
<head><title>AIX Demo</title></head>
<body>
  <h1>Hello from AIX</h1>
  <p>This file was created by AIX.</p>
</body>
</html>
`;
      const filePath = createFile("demo.html", html);
      updateState("HTML file created");
      result = `HTML file created at ${filePath}`;
    }

    // SCREENSHOT EXECUTOR
    if (command.goal.toLowerCase().includes("screenshot")) {
      const targetUrl = "https://example.com";
      await takeScreenshot(targetUrl);
      updateState("Screenshot taken");
      result = "Screenshot taken successfully";
      imageUrl = "/aix-output/screenshot.png";
    }

    res.json({
      command,
      plan,
      result,
      imageUrl,
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AIX CORE running on port", PORT);
});
