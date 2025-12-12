import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import aixRouter from "./routes/aix.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
}));

app.use(bodyParser.json());

// Health Check
app.get("/", (req, res) => {
  res.json({
    ok: true,
    msg: "🔥 Boss AIX Backend LIVE",
    time: new Date(),
  });
});

// AIX Main Route
app.use("/api/aix", aixRouter);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 AIX BACKEND ERROR:", err.message);
  res.status(500).json({
    status: "AIX_CRASH",
    repair: "AUTO_REPAIR_STARTED",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Boss AIX Backend running on PORT ${PORT}`)
);
