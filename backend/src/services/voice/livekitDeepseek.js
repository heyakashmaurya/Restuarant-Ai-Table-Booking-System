import * as openai from "@livekit/agents-plugin-openai";
import dotenv from "dotenv"
dotenv.config();

// const controller = new AbortController();


export const deepseekLLM = new openai.LLM({
    
    // model: "deepseek-chat",
    model: "deepseek-v4-flash",
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
    // signal: controller.signal,
});
