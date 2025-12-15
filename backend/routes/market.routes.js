import express from "express";
import { searchProducts } from "../controllers/market.controller.js";

const router = express.Router();

router.post("/products", searchProducts);

export default router;
