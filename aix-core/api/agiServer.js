const express = require("express");
const { runAGI } = require("../core/agiLoop");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "REAL AGI BRAIN RUNNING" });
});

app.post("/think", async (req, res) => {
  const task = req.body.task;
  const result = await runAGI(task);
  res.json(result);
});

app.listen(9000, () => console.log("🧠 REAL AGI RUNNING ON 9000"));
