import express from "express";
import { makeOutboundCall } from "../controllers/outboundCallController.js";

const router = express.Router();

router.post("/call", makeOutboundCall);

export default router;