export function parseCommand(text = "") {
  const lines = text.split("\n");
  const cmd = { goal: "", context: "", rules: "", output: "", url: "" };

  for (let l of lines) {
    if (l.startsWith("GOAL:")) cmd.goal = l.replace("GOAL:", "").trim();
    if (l.startsWith("CONTEXT:")) cmd.context = l.replace("CONTEXT:", "").trim();
    if (l.startsWith("RULES:")) cmd.rules = l.replace("RULES:", "").trim();
    if (l.startsWith("OUTPUT:")) cmd.output = l.replace("OUTPUT:", "").trim();
    if (l.startsWith("URL:")) cmd.url = l.replace("URL:", "").trim();
  }
  return cmd;
}
