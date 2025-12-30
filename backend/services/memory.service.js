

const MessageSchema = new mongoose.Schema({
  sessionId: String,
  role: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("AIX_Message", MessageSchema);

export async function saveMessage(sessionId, userText, aiText) {
  await Message.create([
    { sessionId, role: "user", content: userText },
    { sessionId, role: "assistant", content: aiText.text }
  ]);
}

export async function getHistory(sessionId, limit = 10) {
  const msgs = await Message.find({ sessionId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return msgs.reverse().map(m => ({
    role: m.role,
    content: m.content
  }));
}
