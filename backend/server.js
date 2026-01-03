import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

/* ========= HEALTH CHECK ========= */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* ========= BASIC CHAT (AIX CORE) ========= */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `बॉस, मी ऐकलं 👉 "${message}"`,
    note: "AIX core is alive. Next step: real actions."
  });
});

/* ========= START SERVER ========= */
app.listen(PORT, () => {
  console.log(`🚀 AIX server running on port ${PORT}`);
});
