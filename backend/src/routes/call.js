export const connectLivekit = (req,res)=>{


const VoiceResponse = twilio.twiml.VoiceResponse;


const twiml = new VoiceResponse();



const dial = twiml.dial({

    answerOnBridge:true

});



dial.sip(

"sip:2n5ui124tl0.sip.livekit.cloud"

);



res
.type("text/xml")
.send(
twiml.toString()
);



};