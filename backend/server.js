import express from "express";

const app = express();
const PORT = 8080;

/* 🔒 VERY IMPORTANT */
app.disable("x-powered-by");

/* 🔹 BASIC MIDDLEWARE */
app.use(express.json());

/* 🔹 HEALTH CHECK (TOP PRIORITY) */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "AIX",
    mode: "ONLINE",
    time: new Date().toISOString()
  });
});

/* 🔹 FALLBACK (HTML येऊ नये म्हणून) */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

/* 🔹 START SERVER */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AIX BASE SERVER RUNNING ON PORT ${PORT}`);
});
