import talk from "./tools/talk.tool.js";
import fileTool from "./tools/file.tool.js";
import infoTool from "./tools/info.tool.js";

export default async function aixAgent(userMessage) {
  // 1. Think
  const thought = await talk(userMessage);

  // 2. Decide (simple logic – extendable)
  if (userMessage.includes("file")) {
    return await fileTool(userMessage);
  }

  if (userMessage.includes("news") || userMessage.includes("weather")) {
    return await infoTool(userMessage);
  }

  // 3. Default reply
  return {
    reply: thought,
    action: "TALK",
    done: true
  };
}
