

import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

const cache = new Map();

const safeJSONParse = (text) => {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
};

const quickExtract = (text) => {
  const data = {};

  const num = text.match(/\d+/);
  if (num) data.guests = Number(num[0]);

  if (/book|table|reservation/i.test(text)) {
    data.intent = "booking";
  }

  return data;
};

export const processConversation = async (userMessage, context = {}) => {
  try {
    if (cache.has(userMessage)) {
      return cache.get(userMessage);
    }

    const quick = quickExtract(userMessage);

    if (quick.guests && !context.guests) {
      return {
        ...quick,
        reply: `Great, booking for ${quick.guests} people. Which date would you like?`
      };
    }

    const prompt = `
Extract booking info AND generate reply.

Context: ${JSON.stringify(context)}
User: "${userMessage}"

Return ONLY JSON:
{
  "intent": "booking | inquiry | cancel",
  "guests": number | null,
  "date": string | null,
  "time": string | null,
  "name": string | null,
  "reply": string
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = safeJSONParse(text);

    if (!parsed) throw new Error("Invalid JSON");

    cache.set(userMessage, parsed);

    return parsed;
  } catch (error) {
    console.error("Gemini Error:", error.message);

    return {
      intent: "inquiry",
      guests: null,
      date: null,
      time: null,
      name: null,
      reply: "Sorry, I didn’t catch that. Could you repeat?"
    };
  }
};


// import { GoogleGenerativeAI } from "@google/generative-ai";
// import env from "../config/env.js";

// const genAI = new GoogleGenerativeAI(env.geminiApiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash"
// });

// /* ---------------------------------- */
// /* Safe JSON Parser                   */
// /* ---------------------------------- */
// const safeJSONParse = (text) => {
//   try {
//     const clean = text.replace(/```json|```/g, "").trim();
//     return JSON.parse(clean);
//   } catch {
//     return null;
//   }
// };

// /* ---------------------------------- */
// /* Extract Structured Data (Optimized)*/
// /* ---------------------------------- */
// export const processConversation = async (userMessage, context = {}) => {
//   try {
//     const prompt = `
// Extract booking details from user input.

// Context: ${JSON.stringify(context)}
// User: "${userMessage}"

// Return ONLY JSON:
// {
//   "intent": "booking | inquiry | cancel",
//   "guests": number | null,
//   "date": string | null,
//   "time": string | null,
//   "name": string | null
// }
// `;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     const parsed = safeJSONParse(text);

//     if (!parsed) throw new Error("Invalid JSON");

//     return parsed;
//   } catch (error) {
//     console.error("Gemini Parse Error:", error.message);

//     // 🔥 fallback (VERY IMPORTANT for voice apps)
//     return {
//       intent: "inquiry",
//       guests: null,
//       date: null,
//       time: null,
//       name: null
//     };
//   }
// };

// /* ---------------------------------- */
// /* Generate Reply (Optimized)         */
// /* ---------------------------------- */
// export const generateReply = async (session) => {
//   try {
//     // 🔥 If almost complete → skip Gemini (SAVE COST)
//     if (session.intent === "booking") {
//       if (!session.guests) return "For how many people?";
//       if (!session.date) return "Which date would you like?";
//       if (!session.time) return "What time should I book?";
//     }

//     const prompt = `
// You are a restaurant assistant.

// Booking state:
// ${JSON.stringify(session)}

// Respond naturally in one short sentence.
// Ask only missing info or confirm booking.
// `;

//     const result = await model.generateContent(prompt);

//     return result.response.text().trim();
//   } catch (error) {
//     console.error("Reply Error:", error.message);

//     return "Sorry, could you repeat that?";
//   }
// };

