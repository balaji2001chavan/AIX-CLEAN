import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function askBrain(message) {

  const res = await axios.post(
    `${process.env.OLLAMA_URL}/api/generate`,
    {
      model: "llama3",
      prompt: message,
      stream: false
    }
  );

  return res.data.response;
}
