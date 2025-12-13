import express from "express";
import cors from "cors";
import askRouter from "./ai/ai.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "AIX Backend Alive" });
});

app.use("/api/ask", askRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 AIX Backend Running on PORT", PORT);
});
