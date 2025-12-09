import manifest from "../ai/master-manifest.js";
import { createFile, updateFile, appendFile } from "./code-writer.js";

export function processCommand(command) {
  const cmd = command.toLowerCase();

  let action = {
    status: "thinking",
    command: cmd,
    actions: []
  };

  // Example logic
  if (cmd.includes("create universe")) {
    action.actions.push({
      type: "createFile",
      file: "./universe/index.js",
      content: "// Universe rendering setup coming soon..."
    });
  }

  if (cmd.includes("add stars") || cmd.includes("create stars")) {
    action.actions.push({
      type: "createFile",
      file: "./universe/stars.js",
      content: "// Star field generator"
    });
  }

  // Execute planned actions
  action.actions.forEach(task => {
    if (task.type === "createFile") createFile(task.file, task.content);
    if (task.type === "updateFile") updateFile(task.file, task.content);
    if (task.type === "appendFile") appendFile(task.file, task.content);
  });

  action.status = "complete";
  return action;
}
