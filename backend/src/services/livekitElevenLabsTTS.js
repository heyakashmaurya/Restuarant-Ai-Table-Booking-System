

import * as elevenlabs from "@livekit/agents-plugin-elevenlabs";
import dotenv from "dotenv";

dotenv.config();

export function elevenlabsTTS() {
    return new elevenlabs.TTS({
        apiKey: process.env.ELEVENLABS_API_KEY,

        voice: {
            id: "EXAVITQu4vr4xnSDxMaL",
        },

        model: "eleven_flash_v2_5",

        language: "en",
    });
}