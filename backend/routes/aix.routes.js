import express from "express";
import { aixCommand } from "../controllers/aix.controller.js";
import { approveChange } from "../approval/approval.controller.js";

// 🔴 IMPORTANT: router आधी define करायचा
const router = express.Router();

// ✅ AIX main command
router.post("/command", aixCommand);

// ✅ Approval endpoint
router.post("/approve-change", approveChange);

export default router;
