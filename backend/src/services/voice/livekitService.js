import dotenv from "dotenv"
dotenv.config()
import {
    AccessToken
} from "livekit-server-sdk";


export const createLiveKitToken = async (
    roomName,
    participantName
) => {


    const token =
        new AccessToken(
            process.env.LIVEKIT_API_KEY,
            process.env.LIVEKIT_API_SECRET,
            {
                identity: participantName
            }
        );


    token.addGrant({

        roomJoin: true,

        room: roomName

    });


    const jwt =
        await token.toJwt();


    return jwt;

};