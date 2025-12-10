import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

let memory = []; // conversation memory

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Boss AIX Backend LIVE ✅" });
});

function smartReply(user) {
  const u = user.toLowerCase();

  if (u.includes("तू कोण")) {
    return "मी Boss AIX आहे. तुमचा डिजिटल मित्र. ChatGPT सारखाच, पण तुमचा स्वतःचा 😌";
  }

  if (u.includes("काय करू शकतो")) {
    return `मी सध्या:
• माहिती देऊ शकतो
• कल्पना सुचवतो
• पुढे AI brain जोडून सगळी real कामं करू शकतो

हळूहळू मोठा होतोय Boss 😎`;
  }

  if (u.includes("कसा आहेस")) {
    return "मी एकदम फ्रेश आहे 😄 तुम्ही सांगा काय चाललंय?";
  }

  // contextual reply
  if (memory.length > 0) {
    return `तुम्ही आधी म्हणालात: "${memory[memory.length - 1]}"
आता नवीन प्रश्न विचारा, मी लक्ष देतोय.`;
  }

  return "बोला Boss, मी पूर्ण लक्ष देऊन ऐकतोय 👂";
}

app.post("/api/boss/command", (req, res) => {
  const message = req.body.message || "";

  memory.push(message);
  if (memory.length > 10) memory.shift();

  const reply = smartReply(message);

  res.json({
    text: reply,
    mood: "friendly",
    memoryCount: memory.length
  });
});

app.listen(PORT, () => {
  console.log(`✅ Boss AIX running on ${PORT}`);
});
