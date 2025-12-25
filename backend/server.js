import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OUTPUT_DIR = path.join(process.cwd(), "output");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// ================= STATUS =================
app.get("/api/status", (req, res) => {
  res.json({
    mode: "AIX-LIVE",
    aiAvailable: true,
    time: new Date().toISOString()
  });
});

// ================= CHAT =================
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  const reply = `
नमस्कार बॉस 👋  
तुम्ही म्हणालात: "${message}"

मी AIX आहे —  
मी माहिती देऊ शकतो, live data आणू शकतो,  
आणि output तयार करून दाखवू शकतो.

पुढे काय करू?
• Live News  
• Tech Updates  
• Product Info  
• Image / Video demo
`;

  res.json({ reply });
});

// ================= LIVE NEWS =================
app.get("/api/news", async (req, res) => {
  res.json({
    source: "Live News (demo)",
    headlines: [
      "भारतामध्ये AI adoption वेगाने वाढत आहे",
      "2025 मध्ये Electric Vehicles मोठी झेप घेणार",
      "AI + Automation मुळे नवीन jobs तयार होत आहेत"
    ]
  });
});

// ================= TECHNOLOGY =================
app.get("/api/tech", async (req, res) => {
  res.json({
    tech: [
      "AI Agents",
      "Text-to-Video",
      "Robotics",
      "Smart Apps",
      "Autonomous Systems"
    ]
  });
});

// ================= WEATHER =================
app.get("/api/weather", (req, res) => {
  res.json({
    location: "India",
    temperature: "32°C",
    condition: "Sunny",
    time: new Date().toLocaleString()
  });
});

// ================= MEDIA (DEMO) =================
app.post("/api/media", (req, res) => {
  const filename = `aix_output_${Date.now()}.txt`;
  const filePath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(
    filePath,
    "AIX generated media demo output\nTime: " + new Date().toISOString()
  );

  res.json({
    success: true,
    preview: `/output/${filename}`
  });
});

// ================= OUTPUT =================
app.use("/output", express.static(OUTPUT_DIR));

// ================= START =================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🔥 AIX LIVE on port", PORT);
});
