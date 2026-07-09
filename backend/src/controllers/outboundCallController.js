
import twilio from "twilio";


import { processConversation } from "../services/geminiService.js";
import Reservation from "../models/Reservation.js";
import env from "../config/env.js";

const client = twilio(
  env.twilioAccountSid,
  env.twilioAuthToken
);

const VoiceResponse = twilio.twiml.VoiceResponse;

const BASE_URL = env.baseUrl;

/* ---------------------------------- */
/* In-Memory Sessions                 */
/* ---------------------------------- */
const sessions = new Map();

/* ---------------------------------- */
/* Get Session                        */
/* ---------------------------------- */
const getSession = (caller) => {
  if (!sessions.has(caller)) {
    sessions.set(caller, {
      intent: null,
      guests: null,
      date: null,
      time: null,
      name: null,
      phone: caller,
      confirmed: false,
      awaitingConfirmation: false
    });
  }

  return sessions.get(caller);
};

/* ---------------------------------- */
/* Update Session                     */
/* ---------------------------------- */
const updateSession = (session, data) => {
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      session[key] = data[key];
    }
  }
};

/* ---------------------------------- */
/* Clear Session                      */
/* ---------------------------------- */
const clearSession = (caller) => {
  sessions.delete(caller);
};

/* ---------------------------------- */
/* Create Outbound Call               */
/* ---------------------------------- */
export const makeOutboundCall = async (req, res) => {
  try {
    const call = await client.calls.create({
      to: "+918887454709", // your test number
      from: "+16814122238", // Twilio number
      url: `${BASE_URL}/api/call/webhook`,
      method: "POST"
    });

    res.status(200).json({
      success: true,
      callSid: call.sid
    });
  } catch (error) {
    console.error("Outbound Call Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------------------------- */
/* Incoming Webhook                   */
/* ---------------------------------- */
export const incomingCall = (req, res) => {
  console.log("Incoming webhook hit");

  const twiml = new VoiceResponse();

  twiml.say(
    { voice: "alice" },
    "Hello, thanks for calling. How can I help you today?"
  );

  twiml.gather({
    input: ["speech"],
    action: `${BASE_URL}/api/call/process`,
    method: "POST",
    speechTimeout: 2,
    timeout: 5
  });

  res.type("text/xml").send(twiml.toString());
};

/* ---------------------------------- */
/* Process Conversation               */
/* ---------------------------------- */
export const processCall = async (req, res) => {
  const twiml = new VoiceResponse();

  try {
    const speechText = req.body.SpeechResult || "";
    const caller = req.body.From || "unknown";

    console.log("User:", speechText);

    const session = getSession(caller);

    /* ---------------------------------- */
    /* Silence Handling                   */
    /* ---------------------------------- */
    if (!speechText) {
      twiml.say(
        { voice: "alice" },
        "I didn't hear anything. Could you repeat please?"
      );

      twiml.gather({
        input: ["speech"],
        action: `${BASE_URL}/api/call/process`,
        method: "POST",
        speechTimeout: 2,
        timeout: 5
      });

      return res.type("text/xml").send(twiml.toString());
    }

    /* ---------------------------------- */
    /* Confirmation Handling              */
    /* ---------------------------------- */
    if (session.awaitingConfirmation) {
      const reply = speechText.toLowerCase();

      if (
        reply.includes("yes") ||
        reply.includes("correct") ||
        reply.includes("confirm")
      ) {
        session.confirmed = true;
        session.awaitingConfirmation = false;
      } else if (reply.includes("no")) {
        session.awaitingConfirmation = false;

        twiml.say(
          { voice: "alice" },
          "No problem. What would you like to change?"
        );

        twiml.gather({
          input: ["speech"],
          action: `${BASE_URL}/api/call/process`,
          method: "POST",
          speechTimeout: 2,
          timeout: 5
        });

        return res.type("text/xml").send(twiml.toString());
      } else {
        twiml.say(
          { voice: "alice" },
          "Please say yes or no."
        );

        twiml.gather({
          input: ["speech"],
          action: `${BASE_URL}/api/call/process`,
          method: "POST",
          speechTimeout: 2,
          timeout: 5
        });

        return res.type("text/xml").send(twiml.toString());
      }
    }

    /* ---------------------------------- */
    /* AI Processing                      */
    /* ---------------------------------- */
    const result = await processConversation(
      speechText,
      session
    );

    updateSession(session, result);

    let message = result.reply;

    /* ---------------------------------- */
    /* Ask Confirmation                   */
    /* ---------------------------------- */
    if (
      session.intent === "booking" &&
      session.guests &&
      session.date &&
      session.time &&
      !session.confirmed
    ) {
      session.awaitingConfirmation = true;

      message = `Just to confirm, you want a table for ${session.guests} people on ${session.date} at ${session.time}. Does that sound right?`;
    }

    /* ---------------------------------- */
    /* Final Booking                      */
    /* ---------------------------------- */
    if (
      session.intent === "booking" &&
      session.guests &&
      session.date &&
      session.time &&
      session.confirmed
    ) {
      await Reservation.create({
        customerName: session.name || "Guest",
        phone: session.phone,
        guests: session.guests,
        date: session.date,
        time: session.time,
        source: "call"
      });

      message = `Perfect! Your reservation for ${session.guests} people on ${session.date} at ${session.time} is confirmed. We look forward to serving you.`;

      twiml.say(
        { voice: "alice" },
        message
      );

      twiml.hangup();

      clearSession(caller);

      return res.type("text/xml").send(twiml.toString());
    }

    /* ---------------------------------- */
    /* Continue Conversation              */
    /* ---------------------------------- */
    twiml.say(
      { voice: "alice" },
      message
    );

    twiml.gather({
      input: ["speech"],
      action: `${BASE_URL}/api/call/process`,
      method: "POST",
      speechTimeout: 2,
      timeout: 5
    });

    return res.type("text/xml").send(twiml.toString());
  } catch (error) {
    console.error("Process Call Error:", error);

    twiml.say(
      { voice: "alice" },
      "Sorry, something went wrong."
    );

    twiml.hangup();

    return res.type("text/xml").send(twiml.toString());
  }
};

// import twilio from "twilio";
// import env from "../config/env.js";

// const client = twilio(
//   env.twilioAccountSid,
//   env.twilioAuthToken
// );

// export const makeOutboundCall = async (req, res) => {
//    try {
//     const call = await client.calls.create({
//       to: "+918887454709", // your phone
//       // from: "+17179428649", // Twilio US number
//       from: "+16814122238", // Twilio US number
//       url: "https://duvet-twirl-expansive.ngrok-free.dev/api/call/webhook"
//     });

//     res.json({ success: true, callSid: call.sid });
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false });
//   }
// };