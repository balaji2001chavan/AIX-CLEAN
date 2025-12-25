import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const OUTPUT_DIR = path.join(process.cwd(), "output");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

app.use("/output", express.static(OUTPUT_DIR));

// Health
app.get("/api/status", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Create demo output (simulate AIX work)
app.post("/api/aix", (req, res) => {
  const content = req.body.message || "AIX generated this file.";
  const ts = Date.now();
  const filename = `aix_${ts}.txt`;
  const filePath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(filePath, content);
  const meta = {
    type: "text",
    path: `/output/${filename}`,
    createdAt: new Date().toISOString()
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "latest.json"),
    JSON.stringify(meta, null, 2)
  );

  res.json({ success: true, meta });
});

// Latest output metadata
app.get("/api/latest", (req, res) => {
  const metaPath = path.join(OUTPUT_DIR, "latest.json");
  if (!fs.existsSync(metaPath)) return res.json({ empty: true });
  res.json(JSON.parse(fs.readFileSync(metaPath, "utf-8")));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("AIX backend live on", PORT));
