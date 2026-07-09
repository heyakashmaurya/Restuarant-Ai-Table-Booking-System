import * as openai from "@livekit/agents-plugin-openai";
import dotenv from "dotenv";
dotenv.config();
export const deepseekLLM = new openai.LLM({
    model: "deepseek-chat",
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com"
});