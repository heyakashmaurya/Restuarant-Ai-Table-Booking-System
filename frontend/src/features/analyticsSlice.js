import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getAnalyticsOverview,
} from "../services/analyticsApi.js";


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {

    data: null,

    dateRange: {
        from: "",
        to: "",
    },

    loading: false,

    error: null,

};


/*
|--------------------------------------------------------------------------
| Fetch Analytics
|--------------------------------------------------------------------------
*/

export const fetchAnalytics =
    createAsyncThunk(
        "analytics/fetchAnalytics",

        async (
            {
                from,
                to,
            } = {},
            {
                rejectWithValue,
            }
        ) => {

            try {

                return await getAnalyticsOverview({
                    from,
                    to,
                });

            } catch (error) {

                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load analytics."
                );

            }

        }
    );


/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const analyticsSlice =
    createSlice({

        name: "analytics",

        initialState,

        reducers: {

            /*
            |--------------------------------------------------------------
            | Set Date Range
            |--------------------------------------------------------------
            */

            setAnalyticsDateRange: (
                state,
                action
            ) => {

                state.dateRange = {
                    ...state.dateRange,
                    ...action.payload,
                };

            },


            /*
            |--------------------------------------------------------------
            | Clear Analytics
            |--------------------------------------------------------------
            */

            clearAnalytics: (
                state
            ) => {

                state.data = null;

                state.error = null;

            },


            /*
            |--------------------------------------------------------------
            | Clear Error
            |--------------------------------------------------------------
            */

            clearAnalyticsError: (
                state
            ) => {

                state.error = null;

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

            builder

                /*
                |--------------------------------------------------------------
                | Pending
                |--------------------------------------------------------------
                */

                .addCase(
                    fetchAnalytics.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;

                    }
                )


                /*
                |--------------------------------------------------------------
                | Fulfilled
                |--------------------------------------------------------------
                */

                .addCase(
                    fetchAnalytics.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading =
                            false;

                        state.error =
                            null;

                        state.data =
                            action.payload?.data ||
                            null;


                        if (
                            action.payload?.data?.dateRange
                        ) {

                            state.dateRange =
                                action.payload
                                    .data
                                    .dateRange;

                        }

                    }
                )


                /*
                |--------------------------------------------------------------
                | Rejected
                |--------------------------------------------------------------
                */

                .addCase(
                    fetchAnalytics.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading =
                            false;

                        state.error =
                            action.payload ||
                            "Unable to load analytics.";

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
    setAnalyticsDateRange,
    clearAnalytics,
    clearAnalyticsError,
} = analyticsSlice.actions;


/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectAnalytics =
    (state) =>
        state.analytics?.data ||
        null;


export const selectAnalyticsLoading =
    (state) =>
        state.analytics?.loading ||
        false;


export const selectAnalyticsError =
    (state) =>
        state.analytics?.error ||
        null;


export const selectAnalyticsDateRange =
    (state) =>
        state.analytics?.dateRange || {
            from: "",
            to: "",
        };


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default analyticsSlice.reducer;