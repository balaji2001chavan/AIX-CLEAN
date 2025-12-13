import express from "express";
import { brainResponse } from "../ai/brain.js";

const router = express.Router();

router.post("/", async (req,res)=>{
  const { message } = req.body;
  if(!message){
    return res.json({ reply:"काय सांगायचं आहे ते लिहा." });
  }

  const reply = await brainResponse(message);
  res.json({ reply });
});

export default router;
