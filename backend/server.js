// =========================
// AIX FINAL STABLE SERVER
// =========================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// -------------------------
// BASIC SETUP
// -------------------------
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ES module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------
// MIDDLEWARE
// -------------------------
app.use(cors({ origin: "*"}));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// -------------------------
// HEALTH CHECK (VERY IMPORTANT)
// -------------------------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    name: "AIX",
    status: "RUNNING",
    time: new Date().toISOString(),
  });
});

// -------------------------
// BASIC CHAT TEST (NO AI DEPENDENCY)
// -------------------------
app.post("/api/aix/chat", (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `AIX ऐकत आहे बॉस 👑 : "${message}"`,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------
// SERVE FRONTEND (STATIC)
// -------------------------
const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));

// SPA fallback (IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// -------------------------
// START SERVER
// -------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log(`✅ AIX SERVER STARTED`);
  console.log(`🌐 PORT : ${PORT}`);
  console.log(`🧠 MODE : STABLE`);
  console.log("=================================");
});
