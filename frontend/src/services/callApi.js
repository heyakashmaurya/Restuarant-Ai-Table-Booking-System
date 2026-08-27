import api from "./api.js";

/*
|--------------------------------------------------------------------------
| Call API Service
|--------------------------------------------------------------------------
|
| Dashboard
|    ↓
| callSlice.js
|    ↓
| callApi.js
|    ↓
| api.js
|    ↓
| Backend
|
|--------------------------------------------------------------------------
*/

const CALL_BASE_URL = "/call";


/*
|--------------------------------------------------------------------------
| Get Call Logs
|--------------------------------------------------------------------------
|
| GET /api/call/logs
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

export const getCallLogs = async ({
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

    const params = {
        page,
        limit,
    };


    if (callStatus) {
        params.callStatus =
            callStatus;
    }


    if (direction) {
        params.direction =
            direction;
    }


    if (phoneNumber) {
        params.phoneNumber =
            phoneNumber;
    }


    if (customer) {
        params.customer =
            customer;
    }


    if (booking) {
        params.booking =
            booking;
    }


    if (aiOutcome) {
        params.aiOutcome =
            aiOutcome;
    }


    if (sentiment) {
        params.sentiment =
            sentiment;
    }


    if (
        aiHandled !== undefined &&
        aiHandled !== null &&
        aiHandled !== ""
    ) {
        params.aiHandled =
            aiHandled;
    }


    if (
        transferredToHuman !== undefined &&
        transferredToHuman !== null &&
        transferredToHuman !== ""
    ) {
        params.transferredToHuman =
            transferredToHuman;
    }


    if (from) {
        params.from =
            from;
    }


    if (to) {
        params.to =
            to;
    }


    const response =
        await api.get(
            `${CALL_BASE_URL}/logs`,
            {
                params,
            }
        );


    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Call Log
|--------------------------------------------------------------------------
|
| GET /api/call/logs/:id
|
|--------------------------------------------------------------------------
*/

export const getCallLog = async (
    callId
) => {

    if (!callId) {

        throw new Error(
            "Call ID is required."
        );
    }


    const response =
        await api.get(
            `${CALL_BASE_URL}/logs/${callId}`
        );


    return response.data;
};


/*
|--------------------------------------------------------------------------
| Export Default
|--------------------------------------------------------------------------
*/

const callApi = {
    getCallLogs,
    getCallLog,
};

export default callApi;