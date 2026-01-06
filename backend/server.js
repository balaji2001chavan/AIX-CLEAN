import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aixController from "./controllers/aix.controller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: "*",
}));
app.use(express.json());

// HEALTH CHECK (हे HTML नाही, JSON देईल)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    mode: "AGENTIC",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

// MAIN AIX CHAT ROUTE
app.post("/api/aix/chat", aixController.chat);

// ROOT (backend open केल्यावर)
app.get("/", (req, res) => {
  res.json({
    message: "AIX Backend is alive",
    hint: "Use /api/aix/chat"
  });
});

app.listen(8080, "127.0.0.1", () => {
  console.log("AIX running on localhost:8080");
});
