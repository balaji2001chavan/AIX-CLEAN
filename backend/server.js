import express from "express";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "AIX",
    status: "ONLINE",
    time: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 AIX BASE SERVER RUNNING ON 8080");
});
