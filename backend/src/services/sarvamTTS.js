export const tts = {};

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();


export class SarvamTTS {


    constructor() {

        this.apiKey = process.env.SARVAM_API_KEY;

    }



    async synthesize(text) {


        const response = await axios.post(
            "https://api.sarvam.ai/text-to-speech",
            {
                inputs: [
                    text
                ],

                target_language_code: "hi-IN",

                speaker: "meera",

                model: "bulbul:v2"
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "api-subscription-key": this.apiKey
                }

            }
        );


        return response.data.audios[0];

    }


}