import * as openai from "@livekit/agents-plugin-openai";
import { llm, initializeLogger } from "@livekit/agents";
import dotenv from "dotenv";

dotenv.config();

initializeLogger({
    pretty: true,
    level: "info",
});

const apiKey = process.env.DEEPSEEK_API_KEY;

if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is missing from .env");
}

console.log("Creating LiveKit DeepSeek LLM...");

const deepseekLLM = new openai.LLM({
    model: "deepseek-v4-flash",
    apiKey,
    baseURL: "https://api.deepseek.com",
});

console.log("Creating ChatContext...");

const chatCtx = new llm.ChatContext();

chatCtx.addMessage({
    role: "user",
    content: "Say hello in one short sentence.",
});

console.log("Calling LiveKit LLM...");

try {
    const stream = deepseekLLM.chat({
        chatCtx,
    });

    console.log("LiveKit stream created.");

    for await (const chunk of stream) {
        console.log("CHUNK:", chunk);
    }

    console.log("\nLiveKit DeepSeek test completed successfully.");
} catch (error) {
    console.error("\nLIVEKIT DEEPSEEK ERROR:");
    console.error(error);
}