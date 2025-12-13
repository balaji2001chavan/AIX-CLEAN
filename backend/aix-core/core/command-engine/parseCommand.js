export function parseCommand(text) {
  const lines = text.split("\n");

  const command = {
    goal: "",
    context: "",
    rules: "",
    output: ""
  };

  for (let line of lines) {
    if (line.startsWith("GOAL:")) {
      command.goal = line.replace("GOAL:", "").trim();
    }
    if (line.startsWith("CONTEXT:")) {
      command.context = line.replace("CONTEXT:", "").trim();
    }
    if (line.startsWith("RULES:")) {
      command.rules = line.replace("RULES:", "").trim();
    }
    if (line.startsWith("OUTPUT:")) {
      command.output = line.replace("OUTPUT:", "").trim();
    }
  }

  return command;
}
