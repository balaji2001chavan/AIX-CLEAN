import express from "express";
import cors from "cors";

import { parseCommand } from "./aix-core/core/command-engine/parseCommand.js";
import { getState, updateState } from "./aix-core/core/state-engine/stateManager.js";
import { createPlan } from "./aix-core/core/planner/planner.js";
import { createFile } from "./aix-core/executors/files/createFile.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/aix", (req, res) => {
  res.json({ status: "AIX API endpoint is reachable (GET test)" });
});

app.post("/api/aix", (req, res) => {
  const { message } = req.body;

  const command = parseCommand(message);
  const state = getState();
  const plan = createPlan(command, state);

  let result = "Only planning done";

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
    result = `HTML file created at ${filePath}`;
    updateState("HTML demo file created");
  }

  res.json({
    command,
    plan,
    result,
    state: getState()
  });
});

app.get("/", (req, res) => {
  res.send("AIX CORE IS LIVE");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AIX CORE running on port", PORT);
});
