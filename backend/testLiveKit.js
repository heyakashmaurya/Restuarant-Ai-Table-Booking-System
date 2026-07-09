import {
Room
} from "livekit-client";


const room = new Room();


await room.connect(
    process.env.LIVEKIT_URL,
    "YOUR_TOKEN"
);


console.log(
    "Connected to room"
);