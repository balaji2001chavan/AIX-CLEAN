import express from "express";
import cors from "cors";

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

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("AIX CORE IS LIVE");
});

// API TEST (GET)
app.get("/api/aix", (req, res) => {
  res.json({ status: "AIX API endpoint is reachable (GET test)" });
});

// MAIN AIX ENDPOINT
app.post("/api/aix", async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Parse command
    const command = parseCommand(message);

    // 2. Load state
    const state = getState();

    // 3. Plan
    const plan = createPlan(command, state);

    let result = "Only planning done";

    // 4. FILE EXECUTOR (HTML)
    if (
      command.goal.toLowerCase().includes("html") &&
      command.output.toLowerCase().includes("html")
    ) {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>AIX Demo</title>
</head>
<body>
  <h1>Hello from AIX</h1>
  <p>This HTML file was created by AIX CORE.</p>
</body>
</html>
`;
      const filePath = createFile("demo.html", htmlContent);
      updateState("HTML file created");
      result = `HTML file created at ${filePath}`;
    }

    // 5. SCREENSHOT EXECUTOR
    if (command.goal.toLowerCase().includes("screenshot")) {
      const url = "https://example.com";
      const shotPath = await takeScreenshot(url);
      updateState("Website screenshot taken");
      result = `Screenshot saved at ${shotPath}`;
    }

    // 6. Response
    res.json({
      command,
      plan,
      result,
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

// START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AIX CORE running on port", PORT);
});
