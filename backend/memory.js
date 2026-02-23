import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

export async function saveMemory(text) {
  await client.connect();
  const db = client.db("aix");
  await db.collection("memory").insertOne({ text, time: new Date() });
}
