import express from "express";
import {
  incomingCall,
  processCall
} from "../controllers/callController.js";

const router = express.Router();

router.post("/webhook", incomingCall);
router.get("/webhook", incomingCall);
// router.get("/webhook", (req, res) => {
//   res.send("Webhook working ✅");
// });
router.post("/process", processCall);

export default router;