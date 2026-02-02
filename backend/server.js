import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8888;

/* Health check */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AIX",
    status: "RUNNING",
    time: new Date().toISOString()
  });
});

/* AIX Chat */
app.post("/api/aix/chat", async (req, res) => {
  const { message } = req.body;

  // TEMPORARY INTELLIGENCE (later OpenAI / Gemini / HF)
  const reply = `
I understand you said: <b>${message}</b><br/><br/>
I am AIX – your advisor, engineer and executor.<br/>
Next I can:
<ul>
<li>Design an app</li>
<li>Plan a business</li>
<li>Generate code</li>
<li>Automate tasks</li>
</ul>
Tell me what to do next.
  `;

  res.json({
    reply,
    mode: "AGENTIC"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("AIX backend running on port", PORT);
});
