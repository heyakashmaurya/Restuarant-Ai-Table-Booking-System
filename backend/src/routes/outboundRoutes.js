import express from "express";
import { connectLivekit, makeOutboundCall } from "../controllers/outboundCallController.js";

const router = express.Router();

router.post("/call", makeOutboundCall);

router.post(
"/connect-livekit",
(req,res)=>{
console.log("TWILIO HIT");
connectLivekit(req,res);
}
);
export default router;

