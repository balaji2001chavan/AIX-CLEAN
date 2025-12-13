import express from "express";
import cors from "cors";
import aiRouter from "./ai/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "AIX Backend Alive" });
});

app.use("/api/ask", aiRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("AIX Backend running on port", PORT);
});
