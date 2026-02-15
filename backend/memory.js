import mongoose from "mongoose";

const MemorySchema = new mongoose.Schema({
  user: String,
  message: String,
  reply: String,
  createdAt: { type: Date, default: Date.now }
});

export const Memory = mongoose.model("Memory", MemorySchema);

export async function saveMemory(user, message, reply) {
  await Memory.create({ user, message, reply });
}
