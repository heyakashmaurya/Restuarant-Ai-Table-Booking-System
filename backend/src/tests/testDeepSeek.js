import * as openai from "@livekit/agents-plugin-openai";
import dotenv from "dotenv";

dotenv.config();

async function testDeepSeek() {
    console.log("\n========== DEEPSEEK DIRECT TEST ==========");

    const apiKey = process.env.DEEPSEEK_API_KEY;

    console.log("API key loaded:", !!apiKey);
    console.log("API key length:", apiKey?.length || 0);

    if (!apiKey) {
        throw new Error("DEEPSEEK_API_KEY is missing");
    }

    const llm = openai.LLM.withDeepSeek({
        apiKey,
        model: "deepseek-chat",
    });

    console.log("Provider:", llm.provider);
    console.log("Model:", llm.model);
    console.log("Sending test request...");

    const stream = await llm.chat({
        chatCtx: {
            messages: [
                {
                    role: "user",
                    content: "Say exactly: Hello, DeepSeek is working."
                }
            ]
        }
    });

    console.log("LLM stream created:", !!stream);

    let response = "";

    for await (const chunk of stream) {
        console.log("CHUNK:", chunk);

        if (chunk.delta?.text) {
            response += chunk.delta.text;
        }
    }

    console.log("\n========== RESULT ==========");
    console.log(response);
    console.log("============================\n");
}

testDeepSeek().catch((error) => {
    console.error("\n❌ DEEPSEEK TEST FAILED");
    console.error(error);
});