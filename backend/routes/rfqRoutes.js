import express from "express";
import { createRFQ } from "../controllers/rfqControllers.js";

const router = express.Router();

router.post("/", createRFQ);

export default router;
