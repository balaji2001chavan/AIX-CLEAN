import express from "express";
import cors from "cors";
import aixRoute from "./routes/aix.js";

const app = express();
app.use(express.json());

// CORS FIX FOR RENDER
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

app.use("/api/aix", aixRoute);

app.listen(5000, () => {
  console.log("🔥 Boss AIX Backend running on 5000");
});
