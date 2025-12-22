import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const ROOT = process.cwd();
const PROJECTS = path.join(ROOT, "backend/projects");

if (!fs.existsSync(PROJECTS)) fs.mkdirSync(PROJECTS, { recursive: true });

let lastStatus = {
  mode: "READY",
  message: "AIX is idle",
  output: null
};

// -------- SMART COMMAND ----------
app.post("/api/command", async (req, res) => {
  const { project, message } = req.body;

  if (!message) {
    return res.json({ reply: "बॉस, काय करायचं आहे ते सांगा." });
  }

  const projectName =
    project || message.split(" ").slice(0, 3).join("-");

  const projectDir = path.join(PROJECTS, projectName);
  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);

  // SIMPLE INTELLIGENCE (Phase-1)
  if (message.toLowerCase().includes("reel")) {
    const proof = {
      action: "VIDEO_PLAN",
      duration: "15s",
      format: "vertical",
      status: "READY_TO_EXECUTE"
    };

    fs.writeFileSync(
      path.join(projectDir, "proof.json"),
      JSON.stringify(proof, null, 2)
    );

    lastStatus = {
      mode: "WAITING_CONFIRMATION",
      message: "15 सेकंदाचा Instagram Reel तयार करायचा आहे. सुरू करू?",
      output: null
    };

    return res.json({ reply: lastStatus.message });
  }

  if (message.toLowerCase() === "हो") {
    const filePath = path.join(projectDir, "result.txt");
    fs.writeFileSync(
      filePath,
      "AIX EXECUTION SUCCESSFUL\nVideo generation simulated."
    );

    lastStatus = {
      mode: "DONE",
      message: "काम पूर्ण झालं बॉस. Output तयार आहे.",
      output: `/projects/${projectName}/result.txt`
    };

    return res.json({ reply: lastStatus.message });
  }

  return res.json({
    reply: "बॉस, मी समजून घेतोय. कृपया स्पष्ट सांगा."
  });
});

// -------- STATUS ----------
app.get("/api/status", (req, res) => {
  res.json(lastStatus);
});

// -------- STATIC OUTPUT ----------
app.use(
  "/projects",
  express.static(path.join(ROOT, "backend/projects"))
);

// -------- START ----------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AIX Backend running on port", PORT);
});
