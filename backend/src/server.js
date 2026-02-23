import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* HEALTH */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "AIX Backend",
    status: "RUNNING"
  });
});

/* CHAT */
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `🤖 AIX: तुम्ही म्हणालात "${message}"`
  });
});

app.listen(8888, () => {
  console.log("AIX backend running on 8888");
});
