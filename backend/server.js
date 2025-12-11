import express from "express";
import cors from "cors";

import aixRoutes from "./routes/aix.js";

const app = express();

// CORS FIX
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// ROUTES
app.use("/api/aix", aixRoutes);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Boss AIX Backend running on", PORT);
});
