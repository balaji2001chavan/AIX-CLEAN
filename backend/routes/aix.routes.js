import express from "express";
import { aixCommand } from "../controllers/aix.controller.js";
import { approveChange } from "../approval/approval.controller.js";

router.post("/approve-change", approveChange);
const router = express.Router();

router.post("/command", aixCommand);

export default router;
