// ===============================
// AIX FINAL SERVER.JS
// Stable • Simple • Repairable
// ===============================

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ---------- ENV ----------
dotenv.config();

// ---------- PATH FIX ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- APP ----------
const app = express();
const PORT = process.env.PORT || 3000;

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------- OUTPUT DIR ----------
const OUTPUT_DIR = path.join(__dirname, "output");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ---------- MEMORY ----------
let AIX_STATE = {
  mode: "AUTO-HYBRID",
  aiAvailable: true,
  pendingAction: "NO",
  lastError: null,
  startTime: Date.now()
};

// ---------- UTIL ----------
function now() {
  return new Date().toISOString();
}

function saveProof(type, data) {
  const filename = `aix_${Date.now()}.txt`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(
    filepath,
    `AIX OUTPUT\nType: ${type}\nTime: ${now()}\n\n${data}`
  );

  return `/output/${filename}`;
}

// ---------- ROUTES ----------

// Health
app.get("/", (req, res) => {
  res.json({
    name: "AIX CORE",
    status: "ONLINE",
    time: now()
  });
});

// Status (frontend poll safe)
app.get("/api/status", (req, res) => {
  res.json({
    ...AIX_STATE,
    uptimeSeconds: Math.floor((Date.now() - AIX_STATE.startTime) / 1000)
  });
});

// Main AIX Chat + Execute
app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body?.message?.trim();

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message missing"
      });
    }

    // ---- SIMPLE INTELLIGENCE (no hallucination) ----
    let reply = "";
    let proofPath = null;

    if (message.toLowerCase().includes("file")) {
      proofPath = saveProof("FILE", message);
      reply = "फाईल तयार केली आहे बॉस. Proof खाली दिला आहे.";
    } 
    else if (message.toLowerCase().includes("status")) {
      reply = "AIX चालू आहे बॉस. सर्व सिस्टम stable आहे.";
    }
    else {
      reply =
        "मी ऐकतोय बॉस. तुम्ही जे सांगाल ते मी रियल कामात रूपांतर करेन. पुढे आदेश द्या.";
    }

    return res.json({
      success: true,
      reply,
      proof: proofPath,
      time: now()
    });

  } catch (err) {
    AIX_STATE.lastError = err.message;

    return res.status(500).json({
      success: false,
      error: "AIX INTERNAL ERROR",
      details: err.message
    });
  }
});

// ---------- STATIC OUTPUT ----------
app.use("/output", express.static(OUTPUT_DIR));

// ---------- 404 SAFE ----------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    ai: "AIX",
    mode: "online",
    time: new Date().toISOString()
  });
});
// ---------- START ----------
app.listen(PORT, () => {
  console.log(`🔥 AIX Backend LIVE on port ${PORT}`);
});
