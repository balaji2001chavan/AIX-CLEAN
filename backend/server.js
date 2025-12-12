// backend/server.js
import express from "express";
import cors from "cors";
import aixRoute from "./routes/aix.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// MAIN AI ROUTE
app.use("/api/aix", aixRoute);

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Boss AIX Backend running on ${PORT}`);
});
