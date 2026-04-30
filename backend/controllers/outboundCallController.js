import twilio from "twilio";
import env from "../config/env.js";

const client = twilio(
  env.twilioAccountSid,
  env.twilioAuthToken
);

export const makeOutboundCall = async (req, res) => {
   try {
    const call = await client.calls.create({
      to: "+917068311385", // your phone
      from: "+17179428649", // Twilio US number
      url: "https://duvet-twirl-expansive.ngrok-free.dev/api/call/webhook"
    });

    res.json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};