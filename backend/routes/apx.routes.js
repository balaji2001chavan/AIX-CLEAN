import express from "express";
import { apxController } from "../apx/apx.controller.js";

const router = express.Router();

router.post("/apx", apxController);

export default router;
