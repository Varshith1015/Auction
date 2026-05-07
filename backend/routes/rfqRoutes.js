import express from "express";
import { createRFQ ,getAllRFQs, getRFQById,submitBid,closeAuction} from "../controllers/rfqControllers.js";

const router = express.Router();

router.post("/", createRFQ);
router.get("/", getAllRFQs);
router.get("/:id", getRFQById);
router.post("/:id/bids", submitBid);
router.post("/:id/close", closeAuction);
export default router;
