const express = require("express");
const cors = require("cors");
const { runAgent } = require("../loop/agentLoop");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "AGI CORE RUNNING" });
});

app.post("/chat", async (req, res) => {
  const msg = req.body.message;

  const result = await runAgent(msg);

  res.json(result);
});

app.listen(9000, () =>
  console.log("🧠 AGI CORE RUNNING ON 9000")
);
