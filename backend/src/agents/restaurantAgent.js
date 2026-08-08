

import {
    WorkerOptions,
    cli,
    defineAgent,
    voice,
} from "@livekit/agents";

import { llm } from "@livekit/agents";

import { livekitRestaurantTools } from "../tools/livekitTools.js";

import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

import { createDeepgramSTT } from "../services/voice/deepgramSTT.js";
// import { LiveKitSarvamTTS } from "../services/livekitSarvamTTS.js";

import { deepseekLLM } from "../services/voice/livekitDeepseek.js";
import { elevenlabsTTS } from "../services/voice/livekitElevenLabsTTS.js";
// import { inference } from "@livekit/agents";

// const vad = new inference.VAD({
//     model: "silero",
//     minSpeechDuration: 0.05,
//     minSilenceDuration: 0.3,
// });

console.log(
    "Deepgram Key Loaded:",
    !!process.env.DEEPGRAM_API_KEY
);

export default defineAgent({

    entry: async (ctx) => {

        console.log("🚀 Agent job started");

        /*
            Connect Agent to the room
        */
        await ctx.connect();

        console.log(
            "✅ Connected to room:", 
            ctx.room.name
        );

        /*
            STT, TTS and LLM Setup
        */
        const stt = createDeepgramSTT();
        // const tts = new LiveKitSarvamTTS();
        const tts = elevenlabsTTS();

        console.log("✅ STT & TTS Pipeline initialized");

        /*
            Agent Brain Instructions
        */

            const agent = new voice.Agent({
    instructions: `
You are an AI restaurant receptionist.

Your job is to help customers with restaurant bookings.

Rules:

1. Start every conversation with:
   "Welcome to our restaurant. How can I help you today?"

2. Collect:
   - Customer name
   - Number of guests
   - Date
   - Time

3. Ask only one question at a time.

4. Keep replies short and natural.

5. Confirm booking details before final confirmation.

6. Use the available booking tools whenever you need to:
   - check table availability
   - create a booking
   - retrieve a booking
   - list bookings
   - update a booking
   - cancel a booking

7. Never claim that a booking was created, updated, retrieved, or cancelled unless the corresponding tool succeeds.

8. When a tool returns an error, explain the problem naturally to the customer and do not pretend the operation succeeded.

Example:

Customer:
I want a table tomorrow at 7 PM.

Assistant:
Sure. How many guests will be joining you?
    `,

    tools: livekitRestaurantTools,
});
//         const agent = new voice.Agent({
//             instructions: `
// You are an AI restaurant receptionist.
// Your job is to book restaurant tables.

// Rules:
// 1. Start every conversation with: "Welcome to our restaurant. How can I help you today?"
// 2. Collect:
// - Customer name
// - Number of guests
// - Date
// - Time
// 3. Ask only one question at a time.
// 4. Keep replies short and natural.
// 5. Confirm booking details before final confirmation.

// Example:
// Customer: I want a table tomorrow at 7 PM.
// Assistant: Sure. How many guests will be joining you?
//             `
//         });

        /*
            Voice Pipeline Session Configuration
        */
        const session = new voice.AgentSession({
            stt,
            llm: deepseekLLM,
            tts,
            // vad
        });

        console.log("Starting Agent Session...");

        // Wait for any human participant to match up against or get the first connected user
        const participant = ctx.room.remoteParticipants.values().next().value;

        await session.start({
            agent,
            room: ctx.room,
            // participant: participant // Tells the session who to listen to and speak with!
        });

        ctx.room.on("participantDisconnected", async (participant) => {
    console.log(`📞 ${participant.identity} disconnected`);

    try {
        await session.close();
    } catch (err) {
        console.error(err);
    }
});

        console.log("✅ Agent Session Started");     

        /*
            🔥 TRIGGER GREETING MANDATORY FIX:
            Since the agent is connected, force it to speak the welcome message immediately!
        */
        setTimeout(async () => {
            try {
                console.log("🗣️ Triggering initial agent welcome greeting...");
                await session.say("Welcome to our restaurant. How can I help you today?");
            } catch (err) {
                console.error("❌ Failed to say greeting phrase:", err);
            }
        }, 1500);

        /*
            Debug local tracks to ensure publishing is active
        */
        setTimeout(() => {
            console.log("Published tracks count:", ctx.room.localParticipant.trackPublications.size);
            for (const [sid, publication] of ctx.room.localParticipant.trackPublications) {
                console.log({
                    sid,
                    kind: publication.kind,
                    name: publication.name,
                    subscribed: publication.isSubscribed
                });
            }
        }, 3000);

        /*
            Keep worker alive
        */
        await new Promise(() => {});
    },

});

cli.runApp(
    new WorkerOptions({
        agent: fileURLToPath(import.meta.url),
        agentName: "restaurant-agent",
        wsURL: process.env.LIVEKIT_URL,
        apiKey: process.env.LIVEKIT_API_KEY,
        apiSecret: process.env.LIVEKIT_API_SECRET,
    })
);


// import {
//     WorkerOptions,
//     cli,
//     defineAgent,
//     voice,
// } from "@livekit/agents";

// import { fileURLToPath } from "node:url";
// import dotenv from "dotenv";

// dotenv.config();


// import { createDeepgramSTT } from "../services/deepgramSTT.js";
// import { LiveKitSarvamTTS } from "../services/livekitSarvamTTS.js";
// import { deepseekLLM } from "../services/livekitDeepseek.js";



// console.log(
//     "Deepgram Key Loaded:",
//     !!process.env.DEEPGRAM_API_KEY
// );



// export default defineAgent({

//     entry: async (ctx) => {


//         console.log("🚀 Agent job started");


//         /*
//             Connect SIP participant room
//         */
//         await ctx.connect();


//         console.log(
//             "✅ Connected to room"
//         );



//         /*
//             Debug incoming SIP participant
//         */
//         ctx.room.on(
//             "participantConnected",
//             (participant)=>{

//                 console.log(
//                     "Participant connected:",
//                     participant.identity
//                 );

//             }
//         );



//         /*
//             STT
//         */

//         const stt = createDeepgramSTT();


//         console.log(
//             "✅ Deepgram STT initialized"
//         );



//         /*
//             TTS
//         */

//         const tts = new LiveKitSarvamTTS();


//         console.log(
//             "✅ Sarvam TTS initialized"
//         );



//         /*
//             Agent Brain
//         */

//         const agent = new voice.Agent({

//             instructions: `

// You are an AI restaurant receptionist.

// Your job is to book restaurant tables.

// Rules:

// 1. Start every conversation with:

// "Welcome to our restaurant. How can I help you today?"

// 2. Collect:

// - Customer name
// - Number of guests
// - Date
// - Time

// 3. Ask only one question at a time.

// 4. Keep replies short and natural.

// 5. Confirm booking details before final confirmation.

// Example:

// Customer:
// I want a table tomorrow at 7 PM.

// Assistant:
// Sure. How many guests will be joining you?


//             `

//         });



//         /*
//             Voice Pipeline

//             Customer Voice
//                  |
//                 STT
//                  |
//              DeepSeek LLM
//                  |
//                 TTS
//                  |
//            Customer hears voice

//         */

//         const session = new voice.AgentSession({

//             stt,

//             llm: deepseekLLM,

//             tts,

//         });



//         console.log(
//             "Starting Agent Session..."
//         );



//         await session.start({

//             agent,

//             room: ctx.room,

//         });



//         console.log(
//             "✅ Agent Session Started"
//         );



//         /*
//             Debug local participant
//         */

//         console.log(
//             "Local participant:",
//             ctx.room.localParticipant.identity
//         );



//         console.log(
//             "Published tracks:",
//             ctx.room.localParticipant.trackPublications.size
//         );



//         for (
//             const [
//                 sid,
//                 publication
//             ]
//             of ctx.room.localParticipant.trackPublications
//         ) {

//             console.log({

//                 sid,

//                 kind:
//                     publication.kind,

//                 name:
//                     publication.name

//             });

//         }



//         /*
//             Keep worker alive
//         */

//         await new Promise(
//             ()=>{}
//         );


//     },


// });





// cli.runApp(

//     new WorkerOptions({

//         agent:
//             fileURLToPath(import.meta.url),


//         agentName:
//             "restaurant-agent",


//         wsURL:
//             process.env.LIVEKIT_URL,


//         apiKey:
//             process.env.LIVEKIT_API_KEY,


//         apiSecret:
//             process.env.LIVEKIT_API_SECRET,


//     })

// );



// import {
//     WorkerOptions,
//     cli,
//     defineAgent,
//     voice,
// } from "@livekit/agents";

// import { fileURLToPath } from "node:url";

// import dotenv from "dotenv";
// dotenv.config();


// import { createDeepgramSTT } from "../services/deepgramSTT.js";
// import { LiveKitSarvamTTS } from "../services/livekitSarvamTTS.js";
// import { deepseekLLM } from "../services/livekitDeepseek.js";

// // import * as silero from "@livekit/agents-plugin-silero";

// // inside entry, before session creation
// // const vad = await silero.VAD.load({
// //     minSpeechDuration: 0.05,
// //     minSilenceDuration: 0.5,
// // });


// console.log(
//     "Deepgram Key Loaded:",
//     !!process.env.DEEPGRAM_API_KEY
// );



// export default defineAgent({

//     entry: async (ctx) => {


//         console.log("🚀 Agent job started");


//         // Connect to LiveKit room
//         await ctx.connect();


//         console.log("✅ Connected to room");



//         /*
//             Speech To Text
//             Customer Voice -> Text
//         */
//         const stt = createDeepgramSTT();


//         console.log(
//             "✅ Deepgram STT initialized"
//         );



//         /*
//             Text To Speech
//             Text -> Customer Voice
//         */
//         const tts = new LiveKitSarvamTTS();


//         console.log(
//             "✅ Sarvam TTS initialized"
//         );



//         /*
//             Agent Brain
//             DeepSeek decides response
//         */
//         const agent = new voice.Agent({

//             instructions: `

// You are an AI restaurant receptionist.

// Your job is to help customers book restaurant tables.

// Conversation rules:

// 1. Start with:
// "Welcome to our restaurant. How can I help you today?"

// 2. Collect booking details:

// - Customer name
// - Number of guests
// - Date
// - Time

// 3. Ask only one question at a time.

// 4. Keep responses short and natural.

// 5. Confirm all details before booking.

// Example:

// Customer:
// I want a table tomorrow at 5 PM.

// Assistant:
// Sure, for how many guests?


//             `

//         });



//         /*
//             Voice Pipeline

//             Customer
//                 |
//               STT
//                 |
//              DeepSeek
//                 |
//               TTS
//                 |
//             Customer

//         */
//         const session = new voice.AgentSession({

//             stt,

//             llm: deepseekLLM,

//             tts,
//             // vad

//         });



//         console.log(
//             "Starting Agent Session..."
//         );



//         await session.start({

//             agent,

//             room: ctx.room,
//             roomOutputOptions: {
//                 audioSampleRate: 16000,
//                 audioNumChannels: 1,
//                 audioEnabled: true
//             }



//         });


//         console.log(
//             "✅ Agent Session Started"
//         );

        


//         // /*
//         //   IMPORTANT

//         //   Keep process alive.
//         //   Otherwise session closes
//         //   before audio reply.
//         // */

//         await new Promise(() => { });


//     },


// });





// cli.runApp(

//     new WorkerOptions({

//         agent: fileURLToPath(import.meta.url),


//         agentName:
//             "restaurant-agent",


//         wsURL:
//             process.env.LIVEKIT_URL,


//         apiKey:
//             process.env.LIVEKIT_API_KEY,


//         apiSecret:
//             process.env.LIVEKIT_API_SECRET,

//     })

// );



// import {
//     WorkerOptions,
//     cli,
//     defineAgent,
//     voice,
// } from "@livekit/agents";
// // import { silero } from "@livekit/agents-plugin-silero";
// import * as silero from "@livekit/agents-plugin-silero";

// import { fileURLToPath } from "node:url";

// import dotenv from "dotenv";
// dotenv.config();


// // import { deepseekLLM } from "../services/livekitDeepseek.js";


// console.log(process.env.DEEPGRAM_API_KEY);

// import { createDeepgramSTT } from "../services/deepgramSTT.js";
// import { LiveKitSarvamTTS }
//     from "../services/livekitSarvamTTS.js";
// import { deepseekLLM } from "../services/livekitDeepseek.js";


// export default defineAgent({

//     entry: async (ctx) => {

//         console.log("🚀 Agent job started");

//         await ctx.connect();

//         const stt = createDeepgramSTT();
//         console.log("Deepgram STT created:", stt);

//         const tts = new LiveKitSarvamTTS();

//         console.log("✅ Connected to room");

//         const vad = await silero.VAD.load({
//             minSpeechDuration: 0.05,
//             minSilenceDuration: 0.5,
//         });

//         console.log("✅ Silero VAD loaded");

//         const agent = new voice.Agent({
//             instructions: `
//             You are a restaurant booking receptionist.

//             Ask customer:
//             - number of guests
//             - date
//             - time
//             - name

//             Keep answers short.
//             `
//         });



//         const session = new voice.AgentSession({
//             stt,
//             llm: deepseekLLM,
//             tts,
//             vad,
//         });

//         console.log("Starting session");

//         await session.start({
//             agent,
//             room: ctx.room,
//         });

//         console.log("✅ Session started");

//         await session.generateReply({
//             instructions:
//                 "Welcome the customer and ask their booking requirement."
//         });

//         console.log("✅ Reply generated");

//     },

// });


// cli.runApp(
//     new WorkerOptions({
//         agent: fileURLToPath(import.meta.url),

//         agentName: "restaurant-agent",

//         wsURL: process.env.LIVEKIT_URL,

//         apiKey:
//             process.env.LIVEKIT_API_KEY,

//         apiSecret:
//             process.env.LIVEKIT_API_SECRET,
//     })
// );
