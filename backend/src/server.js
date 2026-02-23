import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askBrain } from "./brain.js";
import { runAgent } from "./agent.js";
import { saveMemory } from "./memory.js";
import { upload } from "./upload.js";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* HEALTH */
app.get("/api/health", (req,res)=>{
  res.json({status:"AIX RUNNING"});
});

/* CHAT */
app.post("/api/chat", async (req,res)=>{

  const message = req.body.message;

  // agent first
  const agentReply = await runAgent(message);

  if(agentReply){
    return res.json({reply:agentReply});
  }

  // brain reply
  const reply = await askBrain(message);

  await saveMemory(message);

  res.json({reply});
});


/* FILE UPLOAD */
app.post("/api/upload", upload.single("file"), async (req,res)=>{

  const content = fs.readFileSync(req.file.path,"utf8");

  const reply = await askBrain(
    `Read this file and explain and improve it:\n${content}`
  );

  res.json({reply});
});

app.listen(process.env.PORT, ()=>{
  console.log("🧠 AIX running on port",process.env.PORT);
});
