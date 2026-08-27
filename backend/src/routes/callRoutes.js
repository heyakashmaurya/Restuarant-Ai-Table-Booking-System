
import express from "express";

import {
    incomingCall,
    processCall,
    listCallLogsController,
    getCallLogController,
} from "../controllers/callController.js";

import protect from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";


const router = express.Router();


/*
|--------------------------------------------------------------------------
| PUBLIC VOICE / TWILIO ROUTES
|--------------------------------------------------------------------------
|
| These endpoints must remain public because Twilio needs to reach them
| from outside your application.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Incoming Call Webhook
|--------------------------------------------------------------------------
|
| POST /api/call/webhook
|
| Twilio sends the incoming call webhook here.
|
|--------------------------------------------------------------------------
*/

router.post(
    "/webhook",
    incomingCall
);


/*
|--------------------------------------------------------------------------
| GET Webhook
|--------------------------------------------------------------------------
|
| GET /api/call/webhook
|
| Useful for basic webhook testing.
|
|--------------------------------------------------------------------------
*/

router.get(
    "/webhook",
    incomingCall
);


/*
|--------------------------------------------------------------------------
| Process Voice Conversation
|--------------------------------------------------------------------------
|
| POST /api/call/process
|
| Twilio sends SpeechResult and call information here.
|
|--------------------------------------------------------------------------
*/

router.post(
    "/process",
    processCall
);


/*
|--------------------------------------------------------------------------
| PROTECTED DASHBOARD CALL LOG ROUTES
|--------------------------------------------------------------------------
|
| Everything below this point requires dashboard authentication.
|
|--------------------------------------------------------------------------
*/

router.use(
    protect
);


/*
|--------------------------------------------------------------------------
| List Call Logs
|--------------------------------------------------------------------------
|
| GET /api/call/logs
|
| Example:
|
| /api/call/logs?page=1&limit=20
|
| Filters:
|
| callStatus
| direction
| phoneNumber
| customer
| booking
| aiOutcome
| sentiment
| aiHandled
| transferredToHuman
| from
| to
|
|--------------------------------------------------------------------------
*/

router.get(
    "/logs",
    authorize(
        "Owner",
        "Manager",
        "Staff"
    ),
    listCallLogsController
);


/*
|--------------------------------------------------------------------------
| Get Single Call Log
|--------------------------------------------------------------------------
|
| GET /api/call/logs/:id
|
|--------------------------------------------------------------------------
*/

router.get(
    "/logs/:id",
    authorize(
        "Owner",
        "Manager",
        "Staff"
    ),
    getCallLogController
);


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default router;


// import express from "express";
// import {
//   incomingCall,
//   processCall
// } from "../controllers/callController.js";

// const router = express.Router();

// router.post("/webhook", incomingCall);
// router.get("/webhook", incomingCall);
// router.post("/process", processCall);



// export default router;