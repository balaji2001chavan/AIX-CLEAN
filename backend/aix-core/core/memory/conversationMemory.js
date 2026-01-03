
const memory = [];

export function addMessage(role, text) {
  memory.push({
    role,
    text,
    time: new Date().toISOString()
  });

  // limit memory
  if (memory.length > 20) memory.shift();
}

export function getConversation() {
  return memory;
}
