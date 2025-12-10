import express from "express";
import cors from "cors";
import bossRoutes from "./routes/boss.routes.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

app.use("/api/boss", bossRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("✅ Boss AIX Backend running on port", PORT)
);
