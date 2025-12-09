import express from "express";
import { generateSuggestions } from "../suggestions/suggestionEngine.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(generateSuggestions());
});

export default router;