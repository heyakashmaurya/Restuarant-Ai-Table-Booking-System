
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
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

    if (num) {
        data.guests = Number(num[0]);
    }

    if (/book|table|reservation/i.test(text)) {
        data.intent = "booking";
    }

    return data;
};

export const processConversation = async (
    userMessage,
    context = {}
) => {

    try {

        // if (cache.has(userMessage)) {
        //     return cache.get(userMessage);
        // }

        const cacheKey = JSON.stringify({
            message: userMessage,
            context: {
                guests: context.guests,
                date: context.date,
                time: context.time,
                name: context.name,
                intent: context.intent
            }
        });

        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }

        const quick = quickExtract(userMessage);

        const prompt = `
Context: ${JSON.stringify(context)}
User: ${userMessage}

Return only JSON:

{
"intent":"",
"guests":null,
"date":null,
"time":null,
"name":null,
"reply":""
}
`;

        //         const prompt = `
        // You are a restaurant booking assistant.

        // Extract booking information from the conversation.

        // Conversation Context:
        // ${JSON.stringify(context)}

        // Customer:
        // "${userMessage}"

        // Return ONLY valid JSON.

        // {
        //   "intent":"booking|inquiry|cancel",
        //   "guests":null,
        //   "date":null,
        //   "time":null,
        //   "name":null,
        //   "reply":""
        // }
        // `;

        console.time("DeepSeek");

        const response = await client.chat.completions.create({

            model: "deepseek-chat",

            messages: [
                {
                    role: "system",
                    content:
                        `
                    You are a restaurant reservation assistant.

                    Return ONLY valid JSON.

                    Rules:
                    - Keep the reply under 15 words.
                    - Never explain.
                    - Never add extra text.

                    Extract:
                    - guests
                    - date
                    - time
                    - name

                If something is missing, ask only for that.

                Never say booking is confirmed until the user confirms by saying postive words like-yes , yeah etc.

                Return ONLY valid JSON.
`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0,
            max_tokens: 100

        });

        console.timeEnd("DeepSeek");

        console.log("Latency:", response.usage);

        if (!response?.choices?.length) {
            throw new Error("No choices returned from DeepSeek.");
        }

        const text = response.choices[0].message.content;

        console.log("Model Output:");
        console.log(text);

        const parsed = safeJSONParse(text);

        parsed.intent = parsed.intent?.toLowerCase();

        if (parsed.intent === "book")
            parsed.intent = "booking";

        if (parsed.intent === "reserve")
            parsed.intent = "booking";

        parsed.name =
            parsed.name?.trim() || null;

        if (!parsed) {
            throw new Error("DeepSeek returned invalid JSON.");
        }

        // cache.set(userMessage, parsed);

        cache.set(cacheKey, parsed);

        return parsed;

    } catch (error) {

        console.error("DeepSeek Error:", error);

        return {
            intent: "inquiry",
            guests: null,
            date: null,
            time: null,
            name: null,
            reply: "Sorry, I didn't catch that. Could you repeat?"
        };
    }
};

// import OpenAI from "openai";
// import dotenv from "dotenv"
// dotenv.config()

// const client = new OpenAI({

//     apiKey: process.env.DEEPSEEK_API_KEY,

//     // baseURL: process.env.DEEPSEEK_BASE_URL
//     baseURL: "https://api.deepseek.com"

// });



// const cache = new Map();



// const safeJSONParse = (text) => {

//     try {

//         const clean =
//             text
//                 .replace(/```json|```/g, "")
//                 .trim();


//         return JSON.parse(clean);


//     } catch {

//         return null;

//     }

// };



// const quickExtract = (text) => {

//     const data = {};


//     const num =
//         text.match(/\d+/);


//     if (num) {

//         data.guests =
//             Number(num[0]);

//     }


//     if (/book|table|reservation/i.test(text)) {

//         data.intent = "booking";

//     }


//     return data;

// };



// export const processConversation =
//     async (
//         userMessage,
//         context = {}
//     ) => {


//         try {


//             if (cache.has(userMessage)) {

//                 return cache.get(userMessage);

//             }



//             const quick =
//                 quickExtract(userMessage);



//             // if (
//             //     quick.guests &&
//             //     !context.guests
//             // ) {

//             //     return {

//             //         ...quick,

//             //         reply:
//             //             `Great, booking for ${quick.guests} people. Which date would you like?`

//             //     };

//             // }




//             const prompt = `

// You are a restaurant booking assistant.

// Extract booking information and decide the next required question.

// Rules:

// If any field is missing, ask only for that field.

// If all fields exist, return intent booking_ready.

// Conversation Context:

// ${JSON.stringify(context)}


// Customer:

// "${userMessage}"


// Return ONLY valid JSON.

// Format:

// {
//  "intent":"booking | inquiry | cancel",
//  "guests":number|null,
//  "date":"string|null",
//  "time":"string|null",
//  "name":"string|null",
//  "reply":"string"
// }

// `;

//             console.time("DeepSeek");

//             const response =
//                 await client.chat.completions.create({

//                     model: "deepseek-v4-flash",
//                     // model: "deepseek-chat",

//                     messages: [
//                         {
//                             role: "system",
//                             content: "You are a restaurant reservation assistant. Return only JSON."
//                         },
//                         {
//                             role: "user",
//                             content: prompt
//                         }
//                     ],

//                     temperature: 0,

//                     max_tokens: 100

//                 });

//             console.timeEnd("DeepSeek");


//             console.log("FULL RESPONSE:");
//             console.dir(response, {
//                 depth: 10
//             });

//             // const response =
//             //     console.time("DeepSeek");

//             // await client.chat.completions.create({

//             //     model: "deepseek-v4-flash",

//             //     messages: [

//             //         {
//             //             role: "system",
//             //             content:
//             //                 "You are a restaurant booking assistant. Return JSON only."
//             //         },

//             //         {
//             //             role: "user",
//             //             content: prompt
//             //         }

//             //     ],

//             //     temperature: 0,

//             //     max_tokens: 100

//             // });


//             // console.timeEnd("DeepSeek");



//             // console.dir(response, {
//             //     depth: null
//             // });
//             //             console.time("DeepSeek");
//             //                 await client.chat.completions.create({

//             //                     model: "deepseek-v4-flash",

//             //                     messages: [

//             //                         {
//             //                             role: "system",
//             //                             content:
//             //                                 `
//             // You are a restaurant reservation assistant.

//             // Important rules:

//             // - Never say a reservation is confirmed until all details are collected.
//             // - Never say "booked" or "reserved" before confirmation.
//             // - Ask for missing information.
//             // - Collect:
//             //   1. Number of guests
//             //   2. Date
//             //   3. Time
//             //   4. Customer name

//             // Only confirm booking after all information is available.
//             // `
//             //                         },

//             //                         {
//             //                             role: "user",
//             //                             content: prompt
//             //                         }

//             //                     ],


//             //                     temperature: 0


//             //                 });
//             //                 console.timeEnd("DeepSeek");


//             if (!response?.choices?.length) {

//                 throw new Error(
//                     "DeepSeek returned empty response"
//                 );

//             }


//             if (!response) {
//                 throw new Error("No response from DeepSeek");
//             }


//             if (!response.choices) {

//                 console.log(
//                     "Unexpected response:",
//                     response
//                 );

//                 throw new Error(
//                     "No choices returned"
//                 );

//             }


//             // const text =
//             //     response.choices[0].message.content;

//             // const text =
//             //     response.choices[0].message.content;
//             // const text =
//             //     response
//             //         .choices[0]
//             //         .message
//             //         .content;



//             const parsed =
//                 safeJSONParse(text);



//             if (!parsed) {

//                 throw new Error(
//                     "DeepSeek returned invalid JSON"
//                 );

//             }



//             cache.set(
//                 userMessage,
//                 parsed
//             );



//             return parsed;



//         } catch (error) {


//             console.error(
//                 "DeepSeek Error:",
//                 error.message
//             );



//             return {

//                 intent: "inquiry",

//                 guests: null,

//                 date: null,

//                 time: null,

//                 name: null,

//                 reply:
//                     "Sorry, I didn’t catch that. Could you repeat?"

//             };


//         }


//     };

// // import OpenAI from "openai";

// // const client = new OpenAI({
// //     apiKey: process.env.DEEPSEEK_API_KEY,
// //     baseURL: process.env.DEEPSEEK_BASE_URL,
// // });

// // export default client;

// // const cache = new Map();

// // const safeJSONParse = (text) => {
// //     try {
// //         const clean = text.replace(/```json|```/g, "").trim();
// //         return JSON.parse(clean);
// //     } catch {
// //         return null;
// //     }
// // };

// // const quickExtract = (text) => {
// //     const data = {};

// //     const num = text.match(/\d+/);
// //     if (num) data.guests = Number(num[0]);

// //     if (/book|table|reservation/i.test(text)) {
// //         data.intent = "booking";
// //     }

// //     return data;
// // };

// // export const processConversation = async (userMessage, context = {}) => {
// //     try {
// //         if (cache.has(userMessage)) {
// //             return cache.get(userMessage);
// //         }

// //         const quick = quickExtract(userMessage);

// //         if (quick.guests && !context.guests) {
// //             return {
// //                 ...quick,
// //                 reply: `Great, booking for ${quick.guests} people. Which date would you like?`
// //             };
// //         }

// //         const prompt = `
// // Extract booking info AND generate reply.

// // Context: ${JSON.stringify(context)}
// // User: "${userMessage}"

// // Return ONLY JSON:
// // {
// //   "intent": "booking | inquiry | cancel",
// //   "guests": number | null,
// //   "date": string | null,
// //   "time": string | null,
// //   "name": string | null,
// //   "reply": string
// // }
// // `;

// //         const result = await model.generateContent(prompt);
// //         const text = result.response.text();

// //         const parsed = safeJSONParse(text);

// //         if (!parsed) throw new Error("Invalid JSON");

// //         cache.set(userMessage, parsed);

// //         return parsed;
// //     } catch (error) {
// //         console.error("Gemini Error:", error.message);

// //         return {
// //             intent: "inquiry",
// //             guests: null,
// //             date: null,
// //             time: null,
// //             name: null,
// //             reply: "Sorry, I didn’t catch that. Could you repeat?"
// //         };
// //     }
// // };
