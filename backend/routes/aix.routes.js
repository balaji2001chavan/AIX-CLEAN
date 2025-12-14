import express from "express";
import { aixCommand } from "../controllers/aix.controller.js";

const router = express.Router();

router.post("/command", aixCommand);

export default router;
