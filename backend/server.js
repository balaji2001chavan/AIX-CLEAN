import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "output");
if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT);

// ---------- STATUS ----------
app.get("/api/status", (req, res) => {
  res.json({
    mode: "AIX-BASE",
    ai: "READY",
    time: new Date().toISOString()
  });
});

// ---------- AIX CORE ----------
app.post("/api/aix", (req, res) => {
  const message = (req.body.message || "").toLowerCase();

  // UI command
  if (message.includes("galaxy")) {
    return res.json({
      type: "UI",
      action: "GALAXY",
      explain:
        "Screen galaxy mode मध्ये बदलेल. Visual effect only.",
      proof: "UI class changed"
    });
  }

  // File command
  if (message.includes("file")) {
    const name = `aix_${Date.now()}.txt`;
    const filePath = path.join(OUTPUT, name);
    fs.writeFileSync(
      filePath,
      "AIX generated this file.\nProof: " +
        new Date().toISOString()
    );

    return res.json({
      type: "FILE",
      explain:
        "File तयार केली आहे. तुम्ही download करू शकता.",
      download: `/output/${name}`,
      proof: name
    });
  }

  // GitHub suggestion (REALISTIC)
  if (message.includes("github")) {
    return res.json({
      type: "GITHUB",
      explain:
        "Direct commit security मुळे शक्य नाही. पण मी exact commands देतो.",
      commands: [
        "git status",
        "git add .",
        "git commit -m 'AIX update'",
        "git push origin main"
      ]
    });
  }

  return res.json({
    type: "INFO",
    explain:
      "आदेश समजला. पुढे image / video / marketplace modules जोडता येतील."
  });
});

app.use("/output", express.static(OUTPUT));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("AIX running on port", PORT)
);
