import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

/* HEALTH CHECK */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* CHAT ENDPOINT */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `🌸 AIX बोलते आहे: मला समजलं – "${message}". चला पुढचं पाऊल ठरवूया.`,
    mode: "AGENTIC"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AIX server running on port ${PORT}`);
});
