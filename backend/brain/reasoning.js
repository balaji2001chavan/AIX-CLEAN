import { detectIntent } from "./intent.detector.js";
import { buildContext } from "./context.builder.js";

export function reasoningEngine(input) {
  const intent = detectIntent(input);
  const context = buildContext(input, intent);

  return {
    input,
    intent,
    context,
    thought: "User च्या उद्देशानुसार विचार चालू आहे"
  };
}
