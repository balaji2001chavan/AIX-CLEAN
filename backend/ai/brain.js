// brain.js – FINAL VERSION
import { remember, recall } from "./memory.js";

// This function will analyse user message and decide meaning
export function interpretCommand(userId, prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes("hello") || lower.includes("hi")) {
    return "greeting";
  }

  if (lower.includes("video")) {
    return "make_video";
  }

  if (lower.includes("marketing")) {
    return "start_marketing";
  }

  if (lower.includes("income") || lower.includes("money")) {
    return "show_income";
  }

  return "normal_chat"; // default
}

// This will store memory + return last 10 chat-history
export function processMemory(userId, prompt, reply) {
  remember(userId, prompt, reply);
  const history = recall(userId);
  return history.slice(-10);
}