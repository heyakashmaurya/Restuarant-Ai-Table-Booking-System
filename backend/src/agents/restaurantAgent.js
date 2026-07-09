

import {
    WorkerOptions,
    cli,
    defineAgent,
    voice,
} from "@livekit/agents";

import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
dotenv.config();


import { createDeepgramSTT } from "../services/deepgramSTT.js";
import { LiveKitSarvamTTS } from "../services/livekitSarvamTTS.js";
import { deepseekLLM } from "../services/livekitDeepseek.js";


console.log(
    "Deepgram Key Loaded:",
    !!process.env.DEEPGRAM_API_KEY
);



export default defineAgent({

    entry: async (ctx) => {


        console.log("🚀 Agent job started");


        // Connect to LiveKit room
        await ctx.connect();


        console.log("✅ Connected to room");



        /*
            Speech To Text
            Customer Voice -> Text
        */
        const stt = createDeepgramSTT();


        console.log(
            "✅ Deepgram STT initialized"
        );



        /*
            Text To Speech
            Text -> Customer Voice
        */
        const tts = new LiveKitSarvamTTS();


        console.log(
            "✅ Sarvam TTS initialized"
        );



        /*
            Agent Brain
            DeepSeek decides response
        */
        const agent = new voice.Agent({

            instructions: `

You are an AI restaurant receptionist.

Your job is to help customers book restaurant tables.

Conversation rules:

1. Start with:
"Welcome to our restaurant. How can I help you today?"

2. Collect booking details:

- Customer name
- Number of guests
- Date
- Time

3. Ask only one question at a time.

4. Keep responses short and natural.

5. Confirm all details before booking.

Example:

Customer:
I want a table tomorrow at 5 PM.

Assistant:
Sure, for how many guests?


            `

        });



        /*
            Voice Pipeline

            Customer
                |
              STT
                |
             DeepSeek
                |
              TTS
                |
            Customer

        */
        const session = new voice.AgentSession({

            stt,

            llm: deepseekLLM,

            tts

        });



        console.log(
            "Starting Agent Session..."
        );



        await session.start({

            agent,

            room: ctx.room,

        });



        console.log(
            "✅ Agent Session Started"
        );



        /*
          IMPORTANT

          Keep process alive.
          Otherwise session closes
          before audio reply.
        */

        await new Promise(() => { });


    },


});





cli.runApp(

    new WorkerOptions({

        agent: fileURLToPath(import.meta.url),


        agentName:
            "restaurant-agent",


        wsURL:
            process.env.LIVEKIT_URL,


        apiKey:
            process.env.LIVEKIT_API_KEY,


        apiSecret:
            process.env.LIVEKIT_API_SECRET,

    })

);



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
