

import twilio from "twilio";
// import { processConversation } from "../services/geminiService.js";
import { processConversation }
  from "../services/deepseekService.js";
import Reservation from "../models/Reservation.js";

const VoiceResponse = twilio.twiml.VoiceResponse;

const sessions = new Map();

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
const updateSession = (session, data) => {

  for (const key in data) {

    if (
      data[key] !== null &&
      data[key] !== undefined
    ) {
      session[key] = data[key];
    }

  }

};

// const updateSession = (session, data) => {
//   for (const key in data) {
//     if (data[key]) {
//       session[key] = data[key];
//     }
//   }
// };

const clearSession = (caller) => {
  sessions.delete(caller);
};

/* ---------------------------------- */
/* Incoming Call                      */
/* ---------------------------------- */
export const incomingCall = (req, res) => {
  const twiml = new VoiceResponse();

  twiml.say(
    {
      // voice: "alice"
      voice: "Polly.Joanna",
      language: "en-US",
    },

    "Hello, thanks for calling. How can I help you today?"
  );

  twiml.gather({
    input: ["speech"],
    action: "https://duvet-twirl-expansive.ngrok-free.dev/api/call/process",
    method: "POST",
    speechTimeout: "auto"
  });

  res.type("text/xml").send(twiml.toString());
};

/* ---------------------------------- */
/* Process Call                       */
/* ---------------------------------- */
export const processCall = async (req, res) => {
  const twiml = new VoiceResponse();

  try {
    const speechText = req.body.SpeechResult || "";
    const caller = req.body.From || "unknown";

    const session = getSession(caller);

    console.log("User:", speechText);

    /* ---------------------------------- */
    /* Handle Confirmation Step           */
    /* ---------------------------------- */
    if (session.awaitingConfirmation) {
      const reply = speechText.toLowerCase();

      if (reply.includes("yes") || reply.includes("correct")) {
        session.confirmed = true;
        session.awaitingConfirmation = false;
      } else if (reply.includes("no")) {
        session.awaitingConfirmation = false;

        twiml.say("No problem. What would you like to change?");

        twiml.gather({
          input: ["speech"],
          action: "https://duvet-twirl-expansive.ngrok-free.dev/api/call/process",
          method: "POST",
          speechTimeout: "auto"
        });

        return res.type("text/xml").send(twiml.toString());
      } else {
        twiml.say("Please say yes or no.");

        twiml.gather({
          input: ["speech"],
          action: "https://duvet-twirl-expansive.ngrok-free.dev/api/call/process",
          method: "POST",
          speechTimeout: "auto"
        });

        return res.type("text/xml").send(twiml.toString());
      }
    }

    /* ---------------------------------- */
    /* AI Processing                      */
    /* ---------------------------------- */
    const result = await processConversation(speechText, session);
    // const result = {
    //   intent: "booking",
    //   guests: 2,
    //   date: "2026-05-20",
    //   time: "7 PM",
    //   name: "Akash",
    //   reply: "Sure, booking for 2 people. What time would you like?"
    // };

    updateSession(session, result);

    let message = result.reply;

    /* ---------------------------------- */
    /* Ask Confirmation                   */
    /* ---------------------------------- */
    if (
      session.intent === "booking | booking_ready | inquiry | cancel" &&
      session.guests &&
      session.date &&
      session.time &&
      session.name &&
      !session.confirmed
    ) {
      session.awaitingConfirmation = true;

      message = `Just to confirm, a table for ${session.guests} people on ${session.date} at ${session.time}. Does that sound right?`;
    }

    /* ---------------------------------- */
    /* Final Booking                      */
    /* ---------------------------------- */
    if (
      session.intent === "booking | booking_ready | inquiry | cancel" &&
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
        time: session.time
      });

      // message = `Perfect! Your table for ${session.guests} people on ${session.date} at ${session.time} is confirmed. We look forward to serving you!`;

      // clearSession(caller);

      message = `Perfect! Your table for ${session.guests} people on ${session.date} at ${session.time} is confirmed. We look forward to serving you. Goodbye!`;

      twiml.say(
        {
          voice: "Polly.Joanna",
          language: "en-US"
        },
        message
      );

      twiml.hangup();

      clearSession(caller);

      return res.type("text/xml").send(twiml.toString());
    }

    /* ---------------------------------- */
    /* Respond                            */
    /* ---------------------------------- */
    twiml.say({ voice: "alice" }, message);

    twiml.gather({
      input: ["speech"],
      action: "https://duvet-twirl-expansive.ngrok-free.dev/api/call/process",
      method: "POST",
      speechTimeout: "auto"
    });

    res.type("text/xml").send(twiml.toString());
  } catch (error) {
    console.error(error);

    twiml.say("Sorry, something went wrong.");

    res.type("text/xml").send(twiml.toString());
  }
};


// import twilio from "twilio";

// import {
//   processConversation,
//   generateReply
// } from "../services/geminiService.js";

// import { findBestAvailableTable } from "../services/allocationService.js";
// import Reservation from "../models/Reservation.js";
// import CallLog from "../models/CallLog.js";

// const VoiceResponse = twilio.twiml.VoiceResponse;

// /* ---------------------------------- */
// /* In-Memory Session Store            */
// /* ---------------------------------- */
// const sessions = new Map();

// /* ---------------------------------- */
// /* Get Session                        */
// /* ---------------------------------- */
// const getSession = (caller) => {
//   if (!sessions.has(caller)) {
//     sessions.set(caller, {
//       intent: null,
//       guests: null,
//       date: null,
//       time: null,
//       name: null,
//       phone: caller
//     });
//   }
//   return sessions.get(caller);
// };

// /* ---------------------------------- */
// /* Update Session                     */
// /* ---------------------------------- */
// const updateSession = (session, data) => {
//   for (const key in data) {
//     if (data[key]) {
//       session[key] = data[key];
//     }
//   }
// };

// /* ---------------------------------- */
// /* Clear Session                      */
// /* ---------------------------------- */
// const clearSession = (caller) => {
//   sessions.delete(caller);
// };



// /* ---------------------------------- */
// /* Incoming Call                      */
// /* ---------------------------------- */
// export const incomingCall = async (req, res) => {
//   const twiml = new VoiceResponse();
// console.log("Incoming webhook hit");
// console.log("Body:", req.body);
//   twiml.say(
//     { voice: "alice" },
//     "Hello, welcome to our restaurant. How may I help you today?"
//   );

//   twiml.gather({
//     input: ["speech"],
//     // action: "/api/call/process",
//     action: "https://duvet-twirl-expansive.ngrok-free.dev/api/call/process",
//     method: "POST",
//     speechTimeout: "auto"
//   });

//   res.type("text/xml").send(twiml.toString());
// };

// /* ---------------------------------- */
// /* Process Call                       */
// /* ---------------------------------- */
// export const processCall = async (req, res) => {
//   try {
//     const speechText = req.body.SpeechResult || "";
//     const caller = req.body.From || "unknown";

//     /* 1. Load session */
//     const session = getSession(caller);

//     /* 2. Extract new data */
//     const extracted = await processConversation(speechText, session);

//     /* 3. Merge into session */
//     updateSession(session, extracted);

//     let message = "";
//     let booking = null;

//     /* 4. Check if ready to book */
//     if (
//       session.intent === "booking" &&
//       session.guests &&
//       session.date &&
//       session.time
//     ) {
//       const table = await findBestAvailableTable({
//         guests: session.guests,
//         date: session.date,
//         time: session.time
//       });

//       if (table) {
//         booking = await Reservation.create({
//           customerName: session.name || "Guest",
//           phone: session.phone,
//           guests: session.guests,
//           date: session.date,
//           time: session.time,
//           tableAssigned: table._id,
//           source: "call"
//         });

//         message = `Your table for ${session.guests} people is confirmed at ${session.time}. Thank you!`;

//         clearSession(caller);
//       } else {
//         message =
//           "Sorry, no table available at that time. Would you like another slot?";
//       }
//     } else {
//       /* 5. Ask missing info */
//       message = await generateReply(session);
//     }

//     /* 6. Save Call Log */
//     await CallLog.create({
//       callerNumber: caller,
//       transcript: speechText,
//       aiResponses: [message],
//       result: booking ? "booked" : session.intent || "inquiry"
//     });

//     /* 7. Respond */
//     const twiml = new VoiceResponse();

//     twiml.say({ voice: "alice" }, message);

//     twiml.gather({
//       input: ["speech"],
//       // action: "/api/call/process",
//       action: "https://duvet-twirl-expansive.ngrok-free.dev/api/call/process",
//       method: "POST",
//       speechTimeout: "auto"
//     });

//     res.type("text/xml").send(twiml.toString());
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Call processing error");
//   }
// };

