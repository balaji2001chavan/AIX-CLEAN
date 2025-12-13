import express from "express";
import cors from "cors";
import { brainResponse } from "./brain.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

app.post("/api/aix", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.json({ reply: "MESSAGE_REQUIRED" });
  }

  const reply = await brainResponse(message);
  res.json({ reply });
});

app.listen(PORT, () => {
  console.log("Boss AIX Backend running on", PORT);
});
