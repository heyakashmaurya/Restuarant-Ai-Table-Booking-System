import mongoose from "mongoose";

import CallLog from "../../models/CallLog.js";


/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const CALL_STATUSES = [
    "Ringing",
    "Answered",
    "Completed",
    "Missed",
    "Busy",
    "Failed",
    "Cancelled",
];

const CALL_DIRECTIONS = [
    "Incoming",
    "Outgoing",
];

const AI_OUTCOMES = [
    "Booking Created",
    "Booking Updated",
    "Booking Cancelled",
    "Availability Checked",
    "Information Requested",
    "Transferred to Human",
    "No Action",
];

const SENTIMENTS = [
    "Positive",
    "Neutral",
    "Negative",
];


/*
|--------------------------------------------------------------------------
| Normalize ID
|--------------------------------------------------------------------------
*/

const normalizeObjectId = (
    value,
    fieldName
) => {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    if (
        !mongoose.Types.ObjectId.isValid(
            value
        )
    ) {
        throw new Error(
            `Invalid ${fieldName}.`
        );
    }

    return value;
};


/*
|--------------------------------------------------------------------------
| Create Call Log
|--------------------------------------------------------------------------
|
| Creates the initial call record.
|
| Typical lifecycle:
|
| Incoming/Outgoing call
|       ↓
| createCallLog()
|       ↓
| status = Ringing / Answered
|
|--------------------------------------------------------------------------
*/

export const createCallLog = async ({
    customer = null,
    booking = null,

    callSid = "",
    roomName = "",

    direction = "Incoming",

    phoneNumber,

    startedAt = new Date(),

    callStatus = "Answered",

    aiOutcome = "No Action",

    transcript = "",

    summary = "",

    recordingUrl = "",

    sentiment = "Neutral",

    aiHandled = true,

    transferredToHuman = false,

    notes = "",
} = {}) => {

    /*
    |--------------------------------------------------------------------------
    | Required Phone Number
    |--------------------------------------------------------------------------
    */

    if (
        !phoneNumber ||
        typeof phoneNumber !== "string" ||
        !phoneNumber.trim()
    ) {
        throw new Error(
            "Phone number is required."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Enum Validation
    |--------------------------------------------------------------------------
    */

    if (
        !CALL_DIRECTIONS.includes(
            direction
        )
    ) {
        throw new Error(
            "Invalid call direction."
        );
    }


    if (
        !CALL_STATUSES.includes(
            callStatus
        )
    ) {
        throw new Error(
            "Invalid call status."
        );
    }


    if (
        !AI_OUTCOMES.includes(
            aiOutcome
        )
    ) {
        throw new Error(
            "Invalid AI outcome."
        );
    }


    if (
        !SENTIMENTS.includes(
            sentiment
        )
    ) {
        throw new Error(
            "Invalid sentiment."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Normalize References
    |--------------------------------------------------------------------------
    */

    const customerId =
        normalizeObjectId(
            customer,
            "customer ID"
        );

    const bookingId =
        normalizeObjectId(
            booking,
            "booking ID"
        );


    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    const callLog =
        await CallLog.create({

            customer:
                customerId,

            booking:
                bookingId,

            callSid:
                String(
                    callSid || ""
                ).trim(),

            roomName:
                String(
                    roomName || ""
                ).trim(),

            direction,

            phoneNumber:
                phoneNumber.trim(),

            startedAt:
                startedAt instanceof Date
                    ? startedAt
                    : new Date(
                        startedAt
                    ),

            callStatus,

            aiOutcome,

            transcript:
                String(
                    transcript || ""
                ),

            summary:
                String(
                    summary || ""
                ),

            recordingUrl:
                String(
                    recordingUrl || ""
                ),

            sentiment,

            aiHandled:
                Boolean(
                    aiHandled
                ),

            transferredToHuman:
                Boolean(
                    transferredToHuman
                ),

            notes:
                String(
                    notes || ""
                ),
        });


    return callLog;
};


/*
|--------------------------------------------------------------------------
| Get Call By ID
|--------------------------------------------------------------------------
*/

export const getCallById = async (
    callId
) => {

    if (
        !callId ||
        !mongoose.Types.ObjectId.isValid(
            callId
        )
    ) {
        throw new Error(
            "Invalid call ID."
        );
    }


    const callLog =
        await CallLog.findById(
            callId
        )
            .populate(
                "customer"
            )
            .populate(
                "booking"
            );


    if (!callLog) {
        throw new Error(
            "Call log not found."
        );
    }


    return callLog;
};


/*
|--------------------------------------------------------------------------
| Get Call By Call SID
|--------------------------------------------------------------------------
|
| Useful for Twilio/provider callbacks.
|
|--------------------------------------------------------------------------
*/

export const getCallBySid = async (
    callSid
) => {

    if (!callSid) {
        return null;
    }


    return await CallLog.findOne({
        callSid:
            String(
                callSid
            ).trim(),
    })
        .populate(
            "customer"
        )
        .populate(
            "booking"
        );
};


/*
|--------------------------------------------------------------------------
| Get Call By Room Name
|--------------------------------------------------------------------------
|
| Useful for LiveKit lifecycle events.
|
|--------------------------------------------------------------------------
*/

export const getCallByRoomName = async (
    roomName
) => {

    if (!roomName) {
        return null;
    }


    return await CallLog.findOne({
        roomName:
            String(
                roomName
            ).trim(),
    })
        .sort({
            startedAt: -1,
        })
        .populate(
            "customer"
        )
        .populate(
            "booking"
        );
};


/*
|--------------------------------------------------------------------------
| List Call Logs
|--------------------------------------------------------------------------
|
| Supported filters:
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
| page
| limit
|
|--------------------------------------------------------------------------
*/

export const listCallLogs = async ({
    callStatus,
    direction,
    phoneNumber,
    customer,
    booking,
    aiOutcome,
    sentiment,
    aiHandled,
    transferredToHuman,

    from,
    to,

    page = 1,
    limit = 20,
} = {}) => {

    const query = {};


    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    if (callStatus) {

        if (
            !CALL_STATUSES.includes(
                callStatus
            )
        ) {
            throw new Error(
                "Invalid call status."
            );
        }

        query.callStatus =
            callStatus;
    }


    /*
    |--------------------------------------------------------------------------
    | Direction
    |--------------------------------------------------------------------------
    */

    if (direction) {

        if (
            !CALL_DIRECTIONS.includes(
                direction
            )
        ) {
            throw new Error(
                "Invalid call direction."
            );
        }

        query.direction =
            direction;
    }


    /*
    |--------------------------------------------------------------------------
    | Phone
    |--------------------------------------------------------------------------
    */

    if (phoneNumber) {

        query.phoneNumber = {
            $regex:
                String(
                    phoneNumber
                ).trim(),

            $options:
                "i",
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Customer
    |--------------------------------------------------------------------------
    */

    if (customer) {

        query.customer =
            normalizeObjectId(
                customer,
                "customer ID"
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Booking
    |--------------------------------------------------------------------------
    */

    if (booking) {

        query.booking =
            normalizeObjectId(
                booking,
                "booking ID"
            );
    }


    /*
    |--------------------------------------------------------------------------
    | AI Outcome
    |--------------------------------------------------------------------------
    */

    if (aiOutcome) {

        if (
            !AI_OUTCOMES.includes(
                aiOutcome
            )
        ) {
            throw new Error(
                "Invalid AI outcome."
            );
        }

        query.aiOutcome =
            aiOutcome;
    }


    /*
    |--------------------------------------------------------------------------
    | Sentiment
    |--------------------------------------------------------------------------
    */

    if (sentiment) {

        if (
            !SENTIMENTS.includes(
                sentiment
            )
        ) {
            throw new Error(
                "Invalid sentiment."
            );
        }

        query.sentiment =
            sentiment;
    }


    /*
    |--------------------------------------------------------------------------
    | AI Handled
    |--------------------------------------------------------------------------
    */

    if (
        aiHandled !== undefined &&
        aiHandled !== null &&
        aiHandled !== ""
    ) {

        query.aiHandled =
            aiHandled === true ||
            aiHandled === "true";
    }


    /*
    |--------------------------------------------------------------------------
    | Human Transfer
    |--------------------------------------------------------------------------
    */

    if (
        transferredToHuman !== undefined &&
        transferredToHuman !== null &&
        transferredToHuman !== ""
    ) {

        query.transferredToHuman =
            transferredToHuman === true ||
            transferredToHuman === "true";
    }


    /*
    |--------------------------------------------------------------------------
    | Date Range
    |--------------------------------------------------------------------------
    */

    if (from || to) {

        query.startedAt = {};

        if (from) {

            const fromDate =
                new Date(
                    from
                );

            if (
                Number.isNaN(
                    fromDate.getTime()
                )
            ) {
                throw new Error(
                    "Invalid start date."
                );
            }

            fromDate.setHours(
                0,
                0,
                0,
                0
            );

            query.startedAt.$gte =
                fromDate;
        }


        if (to) {

            const toDate =
                new Date(
                    to
                );

            if (
                Number.isNaN(
                    toDate.getTime()
                )
            ) {
                throw new Error(
                    "Invalid end date."
                );
            }

            toDate.setHours(
                23,
                59,
                59,
                999
            );

            query.startedAt.$lte =
                toDate;
        }


        if (
            query.startedAt.$gte &&
            query.startedAt.$lte &&
            query.startedAt.$gte >
                query.startedAt.$lte
        ) {
            throw new Error(
                "Start date cannot be after end date."
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    let currentPage =
        Number(
            page
        );

    let currentLimit =
        Number(
            limit
        );


    if (
        !Number.isInteger(
            currentPage
        ) ||
        currentPage < 1
    ) {
        currentPage = 1;
    }


    if (
        !Number.isInteger(
            currentLimit
        ) ||
        currentLimit < 1
    ) {
        currentLimit = 20;
    }


    if (
        currentLimit > 100
    ) {
        currentLimit = 100;
    }


    const skip =
        (
            currentPage - 1
        ) *
        currentLimit;


    /*
    |--------------------------------------------------------------------------
    | Parallel Query
    |--------------------------------------------------------------------------
    */

    const [
        total,
        calls,
    ] = await Promise.all([

        CallLog.countDocuments(
            query
        ),

        CallLog.find(
            query
        )
            .populate(
                "customer"
            )
            .populate(
                "booking"
            )
            .sort({
                startedAt: -1,
            })
            .skip(
                skip
            )
            .limit(
                currentLimit
            ),

    ]);


    /*
    |--------------------------------------------------------------------------
    | Pagination Metadata
    |--------------------------------------------------------------------------
    */

    const totalPages =
        Math.ceil(
            total /
            currentLimit
        );


    return {

        calls,

        total,

        page:
            currentPage,

        limit:
            currentLimit,

        totalPages,
    };
};


/*
|--------------------------------------------------------------------------
| Update Call Log
|--------------------------------------------------------------------------
|
| Generic controlled update.
|
|--------------------------------------------------------------------------
*/

export const updateCallLog = async (
    callId,
    updateData = {}
) => {

    if (
        !callId ||
        !mongoose.Types.ObjectId.isValid(
            callId
        )
    ) {
        throw new Error(
            "Invalid call ID."
        );
    }


    const callLog =
        await CallLog.findById(
            callId
        );


    if (!callLog) {
        throw new Error(
            "Call log not found."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Allowed Fields
    |--------------------------------------------------------------------------
    */

    const allowedFields = [

        "customer",

        "booking",

        "roomName",

        "direction",

        "phoneNumber",

        "startedAt",

        "endedAt",

        "duration",

        "callStatus",

        "aiOutcome",

        "transcript",

        "summary",

        "recordingUrl",

        "sentiment",

        "aiHandled",

        "transferredToHuman",

        "notes",

    ];


    allowedFields.forEach(
        (field) => {

            if (
                updateData[
                    field
                ] !== undefined
            ) {

                callLog[
                    field
                ] =
                    updateData[
                        field
                    ];
            }
        }
    );


    /*
    |--------------------------------------------------------------------------
    | Reference Validation
    |--------------------------------------------------------------------------
    */

    if (
        updateData.customer !==
        undefined
    ) {

        callLog.customer =
            normalizeObjectId(
                updateData.customer,
                "customer ID"
            );
    }


    if (
        updateData.booking !==
        undefined
    ) {

        callLog.booking =
            normalizeObjectId(
                updateData.booking,
                "booking ID"
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Enum Validation
    |--------------------------------------------------------------------------
    */

    if (
        updateData.direction &&
        !CALL_DIRECTIONS.includes(
            updateData.direction
        )
    ) {
        throw new Error(
            "Invalid call direction."
        );
    }


    if (
        updateData.callStatus &&
        !CALL_STATUSES.includes(
            updateData.callStatus
        )
    ) {
        throw new Error(
            "Invalid call status."
        );
    }


    if (
        updateData.aiOutcome &&
        !AI_OUTCOMES.includes(
            updateData.aiOutcome
        )
    ) {
        throw new Error(
            "Invalid AI outcome."
        );
    }


    if (
        updateData.sentiment &&
        !SENTIMENTS.includes(
            updateData.sentiment
        )
    ) {
        throw new Error(
            "Invalid sentiment."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    await callLog.save();


    /*
    |--------------------------------------------------------------------------
    | Return Populated Record
    |--------------------------------------------------------------------------
    */

    await callLog.populate([
        {
            path:
                "customer",
        },

        {
            path:
                "booking",
        },
    ]);


    return callLog;
};


/*
|--------------------------------------------------------------------------
| Complete Call
|--------------------------------------------------------------------------
|
| Convenience method for call-end lifecycle.
|
|--------------------------------------------------------------------------
*/

export const completeCall = async (
    callId,
    {
        endedAt = new Date(),
        duration,
        aiOutcome,
        summary,
        transcript,
        recordingUrl,
        sentiment,
        notes,
    } = {}
) => {

    const callLog =
        await getCallById(
            callId
        );


    callLog.endedAt =
        endedAt;


    if (
        duration !== undefined &&
        duration !== null
    ) {

        const parsedDuration =
            Number(
                duration
            );

        if (
            !Number.isFinite(
                parsedDuration
            ) ||
            parsedDuration < 0
        ) {
            throw new Error(
                "Invalid call duration."
            );
        }

        callLog.duration =
            parsedDuration;

    } else if (
        callLog.startedAt &&
        endedAt
    ) {

        const calculatedDuration =
            Math.max(
                0,
                Math.round(
                    (
                        new Date(
                            endedAt
                        ).getTime() -
                        new Date(
                            callLog.startedAt
                        ).getTime()
                    ) /
                        1000
                )
            );

        callLog.duration =
            calculatedDuration;
    }


    callLog.callStatus =
        "Completed";


    if (
        aiOutcome !== undefined
    ) {
        callLog.aiOutcome =
            aiOutcome;
    }


    if (
        summary !== undefined
    ) {
        callLog.summary =
            summary;
    }


    if (
        transcript !== undefined
    ) {
        callLog.transcript =
            transcript;
    }


    if (
        recordingUrl !== undefined
    ) {
        callLog.recordingUrl =
            recordingUrl;
    }


    if (
        sentiment !== undefined
    ) {
        callLog.sentiment =
            sentiment;
    }


    if (
        notes !== undefined
    ) {
        callLog.notes =
            notes;
    }


    await callLog.save();


    await callLog.populate([
        {
            path:
                "customer",
        },

        {
            path:
                "booking",
        },
    ]);


    return callLog;
};


/*
|--------------------------------------------------------------------------
| Export Constants
|--------------------------------------------------------------------------
*/

export {
    CALL_STATUSES,
    CALL_DIRECTIONS,
    AI_OUTCOMES,
    SENTIMENTS,
};