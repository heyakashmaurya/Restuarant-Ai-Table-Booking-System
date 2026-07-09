// import { TTS } from "../../../node_modules/@livekit/agents/dist/tts/tts.js";
import { TTS, ChunkedStream } from "../../node_modules/@livekit/agents/dist/tts/tts.js";
// import { ChunkedStream } from "../../../node_modules/@livekit/agents/dist/tts/tts.js";
import { AudioFrame } from "@livekit/rtc-node";
import fetch from "node-fetch";


export class LiveKitSarvamTTS extends TTS {

    label = "sarvam";

    constructor() {

        super(
            16000,
            1,
            {
                streaming: false,
                alignedTranscript: false
            }
        );

    }


    synthesize(text, connOptions, abortSignal) {

        return new SarvamChunkedStream(
            text,
            this,
            connOptions,
            abortSignal
        );

    }


    stream() {
        throw new Error(
            "Streaming not implemented"
        );
    }

}



class SarvamChunkedStream extends ChunkedStream {


    label = "sarvam-stream";


    async run() {

        console.log(
            "Generating Sarvam voice:",
            this.inputText
        );


        // TODO:
        // call Sarvam API here


        this.queue.close();

    }

}
