import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const OUTPUT_DIR = path.join(process.cwd(), "output");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// Health
app.get("/api/status", (req, res) => {
  res.json({
    mode: "AIX-BASE",
    aiAvailable: true,
    time: new Date().toISOString()
  });
});

// Main AIX command
app.post("/api/aix", async (req, res) => {
  const { message } = req.body;
  const lower = (message || "").toLowerCase();

  // ---- UI command example ----
  if (lower.includes("galaxy")) {
    return res.json({
      action: "UI_CHANGE",
      effect: "GALAXY_MODE",
      message: "Galaxy mode apply केला आहे"
    });
  }

  // ---- File creation example ----
  if (lower.includes("file")) {
    const filename = `aix-file-${Date.now()}.txt`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, "AIX generated this file.\n");

    return res.json({
      action: "FILE_CREATED",
      file: filename,
      download: `/output/${filename}`,
      message: "File तयार झाली आहे"
    });
  }

  return res.json({
    action: "INFO",
    message:
      "आदेश समजला. पुढे image/video/marketplace modules जोडता येतील."
  });
});

// Serve outputs
app.use("/output", express.static(OUTPUT_DIR));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("AIX Backend running on", PORT)
);
