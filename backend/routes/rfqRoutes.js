import express from "express";
import { createRFQ ,getAllRFQs, getRFQById} from "../controllers/rfqControllers.js";

const router = express.Router();

router.post("/", createRFQ);
router.get("/", getAllRFQs);
router.get("/:id", getRFQById);

export default router;
