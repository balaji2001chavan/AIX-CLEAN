import express from "express";
import { dailySummary, monthlySummary, byCountry, byCategory } from "../dashboards/dashboardEngine.js";

const router = express.Router();

router.get("/daily", (req,res)=> res.json(dailySummary()));
router.get("/monthly", (req,res)=> res.json(monthlySummary()));
router.get("/country", (req,res)=> res.json(byCountry()));
router.get("/category", (req,res)=> res.json(byCategory()));

export default router;