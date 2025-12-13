import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "AIX Backend Alive" });
});

app.post("/api/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    // 🔥 FORCE REPLY (DEBUG MODE)
    if (!prompt) {
      return res.json({ reply: "❌ Prompt missing from request" });
    }

    return res.json({
      reply: "✅ Backend received your message: " + prompt
    });

  } catch (err) {
    return res.json({
      reply: "❌ Backend error: " + err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🔥 AIX Backend DEBUG running on port", PORT);
});
