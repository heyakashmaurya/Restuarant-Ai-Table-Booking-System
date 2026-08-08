
import * as deepgram from "@livekit/agents-plugin-deepgram";
import dotenv from "dotenv";

dotenv.config();
export function createDeepgramSTT() {


    return new deepgram.STT({
        apiKey: process.env.DEEPGRAM_API_KEY,
        model: "nova-3",
        // language: "en",
        language:"multi",
        smartFormat: true,
    });


}