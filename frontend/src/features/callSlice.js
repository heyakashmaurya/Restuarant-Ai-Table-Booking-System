import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getCallLogs,
    getCallLog,
} from "../services/callApi.js";


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {

    /*
    |--------------------------------------------------------------------------
    | Call Data
    |--------------------------------------------------------------------------
    */

    calls: [],

    selectedCall: null,


    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    pagination: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    },


    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */

    filters: {
        callStatus: "",
        direction: "",
        phoneNumber: "",
        customer: "",
        booking: "",
        aiOutcome: "",
        sentiment: "",
        aiHandled: "",
        transferredToHuman: "",
        from: "",
        to: "",
    },


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    loading: false,

    detailsLoading: false,


    /*
    |--------------------------------------------------------------------------
    | Errors
    |--------------------------------------------------------------------------
    */

    error: null,

    detailsError: null,

};


/*
|--------------------------------------------------------------------------
| Fetch Call Logs
|--------------------------------------------------------------------------
*/

export const fetchCallLogs = createAsyncThunk(
    "call/fetchCallLogs",

    async (
        params = {},
        { rejectWithValue }
    ) => {

        try {

            return await getCallLogs(
                params
            );

        } catch (error) {

            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to retrieve call logs."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Fetch Single Call Log
|--------------------------------------------------------------------------
*/

export const fetchCallLog = createAsyncThunk(
    "call/fetchCallLog",

    async (
        callId,
        { rejectWithValue }
    ) => {

        try {

            return await getCallLog(
                callId
            );

        } catch (error) {

            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to retrieve call details."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const callSlice = createSlice({

    name: "call",

    initialState,

    reducers: {

        /*
        |--------------------------------------------------------------------------
        | Set Filters
        |--------------------------------------------------------------------------
        */

        setCallFilters: (
            state,
            action
        ) => {

            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },


        /*
        |--------------------------------------------------------------------------
        | Clear Filters
        |--------------------------------------------------------------------------
        */

        clearCallFilters: (
            state
        ) => {

            state.filters = {
                callStatus: "",
                direction: "",
                phoneNumber: "",
                customer: "",
                booking: "",
                aiOutcome: "",
                sentiment: "",
                aiHandled: "",
                transferredToHuman: "",
                from: "",
                to: "",
            };

        },


        /*
        |--------------------------------------------------------------------------
        | Set Page
        |--------------------------------------------------------------------------
        */

        setCallPage: (
            state,
            action
        ) => {

            const page =
                Number(
                    action.payload
                );

            if (
                Number.isInteger(
                    page
                ) &&
                page >= 1
            ) {

                state.pagination.page =
                    page;
            }

        },


        /*
        |--------------------------------------------------------------------------
        | Set Limit
        |--------------------------------------------------------------------------
        */

        setCallLimit: (
            state,
            action
        ) => {

            const limit =
                Number(
                    action.payload
                );

            if (
                Number.isInteger(
                    limit
                ) &&
                limit >= 1 &&
                limit <= 100
            ) {

                state.pagination.limit =
                    limit;

                state.pagination.page =
                    1;
            }

        },


        /*
        |--------------------------------------------------------------------------
        | Selected Call
        |--------------------------------------------------------------------------
        */

        setSelectedCall: (
            state,
            action
        ) => {

            state.selectedCall =
                action.payload || null;

        },


        /*
        |--------------------------------------------------------------------------
        | Clear Selected Call
        |--------------------------------------------------------------------------
        */

        clearSelectedCall: (
            state
        ) => {

            state.selectedCall =
                null;

            state.detailsError =
                null;
        },


        /*
        |--------------------------------------------------------------------------
        | Clear Main Error
        |--------------------------------------------------------------------------
        */

        clearCallError: (
            state
        ) => {

            state.error =
                null;
        },


        /*
        |--------------------------------------------------------------------------
        | Clear Details Error
        |--------------------------------------------------------------------------
        */

        clearCallDetailsError: (
            state
        ) => {

            state.detailsError =
                null;
        },


        /*
        |--------------------------------------------------------------------------
        | Clear All Call State
        |--------------------------------------------------------------------------
        */

        clearCallState: (
            state
        ) => {

            state.calls = [];

            state.selectedCall = null;

            state.pagination = {
                total: 0,
                page: 1,
                limit: 20,
                totalPages: 0,
            };

            state.error = null;

            state.detailsError = null;
        },

    },


    /*
    |--------------------------------------------------------------------------
    | Async Reducers
    |--------------------------------------------------------------------------
    */

    extraReducers: (
        builder
    ) => {

        /*
        |--------------------------------------------------------------------------
        | FETCH CALL LOGS
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(
                fetchCallLogs.pending,
                (state) => {

                    state.loading =
                        true;

                    state.error =
                        null;
                }
            )

            .addCase(
                fetchCallLogs.fulfilled,
                (
                    state,
                    action
                ) => {

                    state.loading =
                        false;

                    state.error =
                        null;


                    /*
                     * Expected:
                     *
                     * {
                     *   success: true,
                     *   data: {
                     *      calls: [],
                     *      pagination: {}
                     *   }
                     * }
                     */

                    const data =
                        action.payload?.data;


                    state.calls =
                        Array.isArray(
                            data?.calls
                        )
                            ? data.calls
                            : [];


                    state.pagination =
                        data?.pagination ||
                        {
                            total: 0,
                            page: 1,
                            limit: 20,
                            totalPages: 0,
                        };

                }
            )

            .addCase(
                fetchCallLogs.rejected,
                (
                    state,
                    action
                ) => {

                    state.loading =
                        false;

                    state.error =
                        action.payload ||
                        "Unable to retrieve call logs.";
                }
            );


        /*
        |--------------------------------------------------------------------------
        | FETCH SINGLE CALL
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(
                fetchCallLog.pending,
                (
                    state
                ) => {

                    state.detailsLoading =
                        true;

                    state.detailsError =
                        null;
                }
            )

            .addCase(
                fetchCallLog.fulfilled,
                (
                    state,
                    action
                ) => {

                    state.detailsLoading =
                        false;

                    state.detailsError =
                        null;


                    const call =
                        action.payload?.data?.call ||
                        action.payload?.call ||
                        null;


                    state.selectedCall =
                        call;

                }
            )

            .addCase(
                fetchCallLog.rejected,
                (
                    state,
                    action
                ) => {

                    state.detailsLoading =
                        false;

                    state.detailsError =
                        action.payload ||
                        "Unable to retrieve call details.";
                }
            );

    },
});


/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const {
    setCallFilters,
    clearCallFilters,

    setCallPage,
    setCallLimit,

    setSelectedCall,
    clearSelectedCall,

    clearCallError,
    clearCallDetailsError,

    clearCallState,
} = callSlice.actions;


/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectCallLogs =
    (state) =>
        state.call?.calls ||
        [];


export const selectSelectedCall =
    (state) =>
        state.call?.selectedCall ||
        null;


export const selectCallPagination =
    (state) =>
        state.call?.pagination || {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0,
        };


export const selectCallFilters =
    (state) =>
        state.call?.filters || {
            callStatus: "",
            direction: "",
            phoneNumber: "",
            customer: "",
            booking: "",
            aiOutcome: "",
            sentiment: "",
            aiHandled: "",
            transferredToHuman: "",
            from: "",
            to: "",
        };


export const selectCallLoading =
    (state) =>
        state.call?.loading ||
        false;


export const selectCallDetailsLoading =
    (state) =>
        state.call?.detailsLoading ||
        false;


export const selectCallError =
    (state) =>
        state.call?.error ||
        null;


export const selectCallDetailsError =
    (state) =>
        state.call?.detailsError ||
        null;


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default callSlice.reducer;