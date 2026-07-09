import {
AgentDispatchClient
} from "livekit-server-sdk";
import dotenv from "dotenv"
dotenv.config()

const client =
new AgentDispatchClient(
    process.env.LIVEKIT_URL,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
);


export const createDispatch =
async () => {


await client.createDispatch(
    "restaurant-room",
    {
        agentName:
        "restaurant-agent"
    }
);


console.log(
"Agent dispatched"
);


};