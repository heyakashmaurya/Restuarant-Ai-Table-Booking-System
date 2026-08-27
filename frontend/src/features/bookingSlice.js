

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    cancelBooking,
    checkAvailability,
} from "../services/bookingApi.js";


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    /*
    |----------------------------------------------------------------------
    | Booking Data
    |----------------------------------------------------------------------
    */

    bookings: [],

    selectedBooking: null,

    /*
    |----------------------------------------------------------------------
    | Pagination
    |----------------------------------------------------------------------
    */

    pagination: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    },

    /*
    |----------------------------------------------------------------------
    | Filters
    |----------------------------------------------------------------------
    */

    filters: {
        bookingDate: "",
        status: "",
        customer: "",
        bookingSource: "",
        paymentStatus: "",
    },

    /*
    |----------------------------------------------------------------------
    | Availability
    |----------------------------------------------------------------------
    */

    availability: {
        checked: false,
        available: false,
        table: null,
        endTime: null,
        reason: null,
    },

    /*
    |----------------------------------------------------------------------
    | Loading States
    |----------------------------------------------------------------------
    */

    loading: false,

    creating: false,

    updating: false,

    cancelling: false,

    availabilityLoading: false,

    /*
    |----------------------------------------------------------------------
    | Error States
    |----------------------------------------------------------------------
    */

    error: null,

    createError: null,

    updateError: null,

    cancelError: null,

    availabilityError: null,
};


/*
|--------------------------------------------------------------------------
| FETCH BOOKINGS
|--------------------------------------------------------------------------
*/

export const fetchBookings = createAsyncThunk(
    "booking/fetchBookings",

    async (
        params = {},
        { rejectWithValue }
    ) => {
        try {
            return await getBookings(params);
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to retrieve bookings."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| FETCH SINGLE BOOKING
|--------------------------------------------------------------------------
*/

export const fetchBooking = createAsyncThunk(
    "booking/fetchBooking",

    async (
        bookingId,
        { rejectWithValue }
    ) => {
        try {
            return await getBooking(bookingId);
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to retrieve booking."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| CREATE BOOKING
|--------------------------------------------------------------------------
*/

export const createDashboardBooking =
    createAsyncThunk(
        "booking/createBooking",

        async (
            bookingData,
            { rejectWithValue }
        ) => {
            try {
                return await createBooking(
                    bookingData
                );
            } catch (error) {
                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to create booking."
                );
            }
        }
    );


/*
|--------------------------------------------------------------------------
| UPDATE BOOKING
|--------------------------------------------------------------------------
*/

export const updateDashboardBooking =
    createAsyncThunk(
        "booking/updateBooking",

        async (
            {
                bookingId,
                updates,
            },
            { rejectWithValue }


        ) => {
            try {
                return await updateBooking(
                    bookingId,
                    updates,
                    console.log(
                        "THUNK bookingId:",
                        bookingId
                    )
                );


            } catch (error) {
                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to update booking."
                );
            }
        }

    );


/*
|--------------------------------------------------------------------------
| CANCEL BOOKING
|--------------------------------------------------------------------------
*/

export const cancelDashboardBooking =
    createAsyncThunk(
        "booking/cancelBooking",

        async (
            {
                bookingId,
                reason,
                cancelledBy = "Owner",
            },
            { rejectWithValue }
        ) => {
            try {
                return await cancelBooking(
                    bookingId,
                    {
                        reason,
                        cancelledBy,
                    }
                );
            } catch (error) {
                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to cancel booking."
                );
            }
        }
    );


/*
|--------------------------------------------------------------------------
| CHECK AVAILABILITY
|--------------------------------------------------------------------------
*/

export const checkBookingAvailability =
    createAsyncThunk(
        "booking/checkAvailability",

        async (
            params,
            { rejectWithValue }
        ) => {
            try {
                return await checkAvailability(
                    params
                );
            } catch (error) {
                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to check availability."
                );
            }
        }
    );


/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const bookingSlice = createSlice({

    name: "booking",

    initialState,

    reducers: {

        /*
        |------------------------------------------------------------------
        | Set Filters
        |------------------------------------------------------------------
        */

        setBookingFilters: (
            state,
            action
        ) => {

            state.filters = {
                ...state.filters,
                ...action.payload,
            };

        },


        /*
        |------------------------------------------------------------------
        | Clear Filters
        |------------------------------------------------------------------
        */

        clearBookingFilters: (
            state
        ) => {

            state.filters = {
                bookingDate: "",
                status: "",
                customer: "",
                bookingSource: "",
                paymentStatus: "",
            };

        },


        /*
        |------------------------------------------------------------------
        | Set Page
        |------------------------------------------------------------------
        */

        setBookingPage: (
            state,
            action
        ) => {

            state.pagination.page =
                action.payload;

        },


        /*
        |------------------------------------------------------------------
        | Set Limit
        |------------------------------------------------------------------
        */

        setBookingLimit: (
            state,
            action
        ) => {

            state.pagination.limit =
                action.payload;

        },


        /*
        |------------------------------------------------------------------
        | Select Booking
        |------------------------------------------------------------------
        */

        setSelectedBooking: (
            state,
            action
        ) => {

            state.selectedBooking =
                action.payload;

        },


        /*
        |------------------------------------------------------------------
        | Clear Selected Booking
        |------------------------------------------------------------------
        */

        clearSelectedBooking: (
            state
        ) => {

            state.selectedBooking = null;

        },


        /*
        |------------------------------------------------------------------
        | Clear Availability
        |------------------------------------------------------------------
        */

        clearAvailability: (
            state
        ) => {

            state.availability = {
                checked: false,
                available: false,
                table: null,
                endTime: null,
                reason: null,
            };

            state.availabilityError = null;

        },


        /*
        |------------------------------------------------------------------
        | Clear Errors
        |------------------------------------------------------------------
        */

        clearBookingErrors: (
            state
        ) => {

            state.error = null;

            state.createError = null;

            state.updateError = null;

            state.cancelError = null;

            state.availabilityError = null;

        },

    },


    /*
    |--------------------------------------------------------------------------
    | Async Reducers
    |--------------------------------------------------------------------------
    */

    extraReducers: (builder) => {

        /*
        |==================================================================
        | FETCH BOOKINGS
        |==================================================================
        */

        builder

            .addCase(
                fetchBookings.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;

                }
            )

            .addCase(
                fetchBookings.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.error = null;


                    /*
                    |------------------------------------------------------
                    | Backend response:
                    |
                    | {
                    |   success,
                    |   bookings,
                    |   pagination,
                    |   message
                    | }
                    |------------------------------------------------------
                    */

                    state.bookings =
                        action.payload?.bookings ||
                        [];

                    state.pagination =
                        action.payload?.pagination ||
                        {
                            total: 0,
                            page: 1,
                            limit: 20,
                            totalPages: 0,
                        };

                }
            )

            .addCase(
                fetchBookings.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Unable to retrieve bookings.";

                }
            );


        /*
        |==================================================================
        | FETCH SINGLE BOOKING
        |==================================================================
        */

        builder

            .addCase(
                fetchBooking.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;

                }
            )

            .addCase(
                fetchBooking.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.selectedBooking =
                        action.payload?.booking ||
                        null;

                }
            )

            .addCase(
                fetchBooking.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Unable to retrieve booking.";

                }
            );


        /*
        |==================================================================
        | CREATE BOOKING
        |==================================================================
        */

        builder

            .addCase(
                createDashboardBooking.pending,
                (state) => {

                    state.creating = true;

                    state.createError = null;

                }
            )

            .addCase(
                createDashboardBooking.fulfilled,
                (state, action) => {

                    state.creating = false;

                    state.createError = null;


                    const booking =
                        action.payload?.booking;


                    if (booking) {

                        /*
                        |--------------------------------------------------
                        | Add newly created booking to current list.
                        |--------------------------------------------------
                        */

                        state.bookings = [
                            booking,
                            ...state.bookings,
                        ];


                        /*
                        |--------------------------------------------------
                        | Update total count.
                        |--------------------------------------------------
                        */

                        state.pagination.total += 1;

                    }

                }
            )

            .addCase(
                createDashboardBooking.rejected,
                (state, action) => {

                    state.creating = false;

                    state.createError =
                        action.payload ||
                        "Unable to create booking.";

                }
            );


        /*
        |==================================================================
        | UPDATE BOOKING
        |==================================================================
        */

        builder

            .addCase(
                updateDashboardBooking.pending,
                (state) => {

                    state.updating = true;

                    state.updateError = null;

                }
            )

            .addCase(
                updateDashboardBooking.fulfilled,
                (state, action) => {

                    state.updating = false;

                    state.updateError = null;


                    const updatedBooking =
                        action.payload?.booking;


                    if (!updatedBooking) {
                        return;
                    }


                    /*
                    |------------------------------------------------------
                    | Update booking in list.
                    |------------------------------------------------------
                    */

                    const index =
                        state.bookings.findIndex(
                            (booking) =>
                                booking._id ===
                                updatedBooking._id
                        );


                    if (index !== -1) {

                        state.bookings[index] =
                            updatedBooking;

                    }


                    /*
                    |------------------------------------------------------
                    | Update selected booking.
                    |------------------------------------------------------
                    */

                    if (
                        state.selectedBooking?._id ===
                        updatedBooking._id
                    ) {

                        state.selectedBooking =
                            updatedBooking;

                    }

                }
            )

            .addCase(
                updateDashboardBooking.rejected,
                (state, action) => {

                    state.updating = false;

                    state.updateError =
                        action.payload ||
                        "Unable to update booking.";

                }
            );


        /*
        |==================================================================
        | CANCEL BOOKING
        |==================================================================
        */

        builder

            .addCase(
                cancelDashboardBooking.pending,
                (state) => {

                    state.cancelling = true;

                    state.cancelError = null;

                }
            )

            .addCase(
                cancelDashboardBooking.fulfilled,
                (state, action) => {

                    state.cancelling = false;

                    state.cancelError = null;


                    const cancelledBooking =
                        action.payload?.booking;


                    if (!cancelledBooking) {
                        return;
                    }


                    /*
                    |------------------------------------------------------
                    | Replace booking in list.
                    |------------------------------------------------------
                    */

                    const index =
                        state.bookings.findIndex(
                            (booking) =>
                                booking._id ===
                                cancelledBooking._id
                        );


                    if (index !== -1) {

                        state.bookings[index] =
                            cancelledBooking;

                    }


                    /*
                    |------------------------------------------------------
                    | Update selected booking.
                    |------------------------------------------------------
                    */

                    if (
                        state.selectedBooking?._id ===
                        cancelledBooking._id
                    ) {

                        state.selectedBooking =
                            cancelledBooking;

                    }

                }
            )

            .addCase(
                cancelDashboardBooking.rejected,
                (state, action) => {

                    state.cancelling = false;

                    state.cancelError =
                        action.payload ||
                        "Unable to cancel booking.";

                }
            );


        /*
        |==================================================================
        | CHECK AVAILABILITY
        |==================================================================
        */

        builder

            .addCase(
                checkBookingAvailability.pending,
                (state) => {

                    state.availabilityLoading =
                        true;

                    state.availabilityError =
                        null;

                    state.availability.checked =
                        false;

                }
            )

            .addCase(
                checkBookingAvailability.fulfilled,
                (state, action) => {

                    state.availabilityLoading =
                        false;

                    state.availabilityError =
                        null;


                    state.availability = {

                        checked: true,

                        available:
                            Boolean(
                                action.payload?.available
                            ),

                        table:
                            action.payload?.table ||
                            null,

                        endTime:
                            action.payload?.endTime ||
                            null,

                        reason:
                            action.payload?.reason ||
                            null,

                    };

                }
            )

            .addCase(
                checkBookingAvailability.rejected,
                (state, action) => {

                    state.availabilityLoading =
                        false;

                    state.availabilityError =
                        action.payload ||
                        "Unable to check availability.";

                    state.availability = {

                        checked: true,

                        available: false,

                        table: null,

                        endTime: null,

                        reason:
                            action.payload ||
                            "Unable to check availability.",

                    };

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
    setBookingFilters,
    clearBookingFilters,
    setBookingPage,
    setBookingLimit,
    setSelectedBooking,
    clearSelectedBooking,
    clearAvailability,
    clearBookingErrors,
} = bookingSlice.actions;


/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectBookings =
    (state) =>
        state.booking.bookings;

export const selectSelectedBooking =
    (state) =>
        state.booking.selectedBooking;

export const selectBookingPagination =
    (state) =>
        state.booking.pagination;

export const selectBookingFilters =
    (state) =>
        state.booking.filters;

export const selectBookingLoading =
    (state) =>
        state.booking.loading;

export const selectBookingCreating =
    (state) =>
        state.booking.creating;

export const selectBookingUpdating =
    (state) =>
        state.booking.updating;

export const selectBookingCancelling =
    (state) =>
        state.booking.cancelling;

export const selectBookingError =
    (state) =>
        state.booking.error;

export const selectBookingCreateError =
    (state) =>
        state.booking.createError;

export const selectBookingUpdateError =
    (state) =>
        state.booking.updateError;

export const selectBookingCancelError =
    (state) =>
        state.booking.cancelError;

export const selectBookingAvailability =
    (state) =>
        state.booking.availability;

export const selectBookingAvailabilityLoading =
    (state) =>
        state.booking.availabilityLoading;


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default bookingSlice.reducer;


// import {
//     createSlice,
//     createAsyncThunk,
// } from "@reduxjs/toolkit";

// import {
//     getBookings,
//     getBooking,
//     createBooking,
//     updateBooking,
//     cancelBooking,
//     checkBookingAvailability,
// } from "../services/bookingApi.js";


// /*
// |--------------------------------------------------------------------------
// | Initial State
// |--------------------------------------------------------------------------
// */

// const initialState = {
//     bookings: [],

//     selectedBooking: null,

//     pagination: {
//         total: 0,
//         page: 1,
//         limit: 20,
//         totalPages: 0,
//     },

//     filters: {
//         bookingDate: "",
//         status: "",
//         customer: "",
//         bookingSource: "",
//         paymentStatus: "",
//     },

//     availability: {
//         available: false,
//         table: null,
//         endTime: null,
//         reason: null,
//     },

//     loading: false,

//     listLoading: false,

//     detailsLoading: false,

//     mutationLoading: false,

//     availabilityLoading: false,

//     error: null,

//     mutationError: null,

//     availabilityError: null,

//     successMessage: null,
// };


// /*
// |--------------------------------------------------------------------------
// | Get Bookings
// |--------------------------------------------------------------------------
// */

// export const fetchBookings = createAsyncThunk(
//     "booking/fetchBookings",

//     async (
//         params = {},
//         { rejectWithValue }
//     ) => {
//         try {
//             const response =
//                 await getBookings(params);

//             if (!response?.success) {
//                 return rejectWithValue(
//                     response?.message ||
//                     "Unable to load bookings."
//                 );
//             }

//             return response;

//         } catch (error) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 error.message ||
//                 "Unable to load bookings."
//             );
//         }
//     }
// );


// /*
// |--------------------------------------------------------------------------
// | Get Single Booking
// |--------------------------------------------------------------------------
// */

// export const fetchBooking = createAsyncThunk(
//     "booking/fetchBooking",

//     async (
//         bookingId,
//         { rejectWithValue }
//     ) => {
//         try {
//             const response =
//                 await getBooking(bookingId);

//             if (!response?.success) {
//                 return rejectWithValue(
//                     response?.message ||
//                     "Unable to load booking."
//                 );
//             }

//             return response;

//         } catch (error) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 error.message ||
//                 "Unable to load booking."
//             );
//         }
//     }
// );


// /*
// |--------------------------------------------------------------------------
// | Create Booking
// |--------------------------------------------------------------------------
// */

// export const createBookingThunk =
//     createAsyncThunk(
//         "booking/createBooking",

//         async (
//             payload,
//             { rejectWithValue }
//         ) => {
//             try {
//                 const response =
//                     await createBooking(
//                         payload
//                     );

//                 if (!response?.success) {
//                     return rejectWithValue(
//                         response?.message ||
//                         "Unable to create booking."
//                     );
//                 }

//                 return response;

//             } catch (error) {
//                 return rejectWithValue(
//                     error.response?.data?.message ||
//                     error.message ||
//                     "Unable to create booking."
//                 );
//             }
//         }
//     );


// /*
// |--------------------------------------------------------------------------
// | Update Booking
// |--------------------------------------------------------------------------
// */

// export const updateBookingThunk =
//     createAsyncThunk(
//         "booking/updateBooking",

//         async (
//             {
//                 bookingId,
//                 payload,
//             },
//             { rejectWithValue }
//         ) => {
//             try {
//                 const response =
//                     await updateBooking(
//                         bookingId,
//                         payload
//                     );

//                 if (!response?.success) {
//                     return rejectWithValue(
//                         response?.message ||
//                         "Unable to update booking."
//                     );
//                 }

//                 return response;

//             } catch (error) {
//                 return rejectWithValue(
//                     error.response?.data?.message ||
//                     error.message ||
//                     "Unable to update booking."
//                 );
//             }
//         }
//     );


// /*
// |--------------------------------------------------------------------------
// | Cancel Booking
// |--------------------------------------------------------------------------
// */

// export const cancelBookingThunk =
//     createAsyncThunk(
//         "booking/cancelBooking",

//         async (
//             {
//                 bookingId,
//                 reason,
//                 cancelledBy = "admin",
//             },
//             { rejectWithValue }
//         ) => {
//             try {
//                 const response =
//                     await cancelBooking(
//                         bookingId,
//                         {
//                             reason,
//                             cancelledBy,
//                         }
//                     );

//                 if (!response?.success) {
//                     return rejectWithValue(
//                         response?.message ||
//                         "Unable to cancel booking."
//                     );
//                 }

//                 return response;

//             } catch (error) {
//                 return rejectWithValue(
//                     error.response?.data?.message ||
//                     error.message ||
//                     "Unable to cancel booking."
//                 );
//             }
//         }
//     );


// /*
// |--------------------------------------------------------------------------
// | Check Availability
// |--------------------------------------------------------------------------
// */

// export const checkAvailabilityThunk =
//     createAsyncThunk(
//         "booking/checkAvailability",

//         async (
//             params,
//             { rejectWithValue }
//         ) => {
//             try {
//                 const response =
//                     await checkBookingAvailability(
//                         params
//                     );

//                 if (!response?.success) {
//                     return rejectWithValue(
//                         response?.message ||
//                         "Unable to check availability."
//                     );
//                 }

//                 return response;

//             } catch (error) {
//                 return rejectWithValue(
//                     error.response?.data?.message ||
//                     error.message ||
//                     "Unable to check availability."
//                 );
//             }
//         }
//     );


// /*
// |--------------------------------------------------------------------------
// | Slice
// |--------------------------------------------------------------------------
// */

// const bookingSlice = createSlice({
//     name: "booking",

//     initialState,

//     reducers: {

//         /*
//         |----------------------------------------------------------------------
//         | Set Filters
//         |----------------------------------------------------------------------
//         */

//         setBookingFilters: (
//             state,
//             action
//         ) => {
//             state.filters = {
//                 ...state.filters,
//                 ...action.payload,
//             };
//         },


//         /*
//         |----------------------------------------------------------------------
//         | Set Single Filter
//         |----------------------------------------------------------------------
//         */

//         setBookingFilter: (
//             state,
//             action
//         ) => {
//             const {
//                 key,
//                 value,
//             } = action.payload;

//             if (
//                 Object.prototype.hasOwnProperty.call(
//                     state.filters,
//                     key
//                 )
//             ) {
//                 state.filters[key] = value;
//             }
//         },


//         /*
//         |----------------------------------------------------------------------
//         | Clear Filters
//         |----------------------------------------------------------------------
//         */

//         clearBookingFilters: (
//             state
//         ) => {
//             state.filters = {
//                 bookingDate: "",
//                 status: "",
//                 customer: "",
//                 bookingSource: "",
//                 paymentStatus: "",
//             };
//         },


//         /*
//         |----------------------------------------------------------------------
//         | Select Booking
//         |----------------------------------------------------------------------
//         */

//         setSelectedBooking: (
//             state,
//             action
//         ) => {
//             state.selectedBooking =
//                 action.payload;
//         },


//         /*
//         |----------------------------------------------------------------------
//         | Clear Selected Booking
//         |----------------------------------------------------------------------
//         */

//         clearSelectedBooking: (
//             state
//         ) => {
//             state.selectedBooking = null;
//         },


//         /*
//         |----------------------------------------------------------------------
//         | Clear Availability
//         |----------------------------------------------------------------------
//         */

//         clearAvailability: (
//             state
//         ) => {
//             state.availability = {
//                 available: false,
//                 table: null,
//                 endTime: null,
//                 reason: null,
//             };

//             state.availabilityError =
//                 null;
//         },


//         /*
//         |----------------------------------------------------------------------
//         | Clear Errors
//         |----------------------------------------------------------------------
//         */

//         clearBookingErrors: (
//             state
//         ) => {
//             state.error = null;
//             state.mutationError = null;
//             state.availabilityError = null;
//         },


//         /*
//         |----------------------------------------------------------------------
//         | Clear Success Message
//         |----------------------------------------------------------------------
//         */

//         clearBookingSuccess: (
//             state
//         ) => {
//             state.successMessage = null;
//         },

//     },


//     /*
//     |--------------------------------------------------------------------------
//     | Async Actions
//     |--------------------------------------------------------------------------
//     */

//     extraReducers: (builder) => {

//         /*
//         |----------------------------------------------------------------------
//         | FETCH BOOKINGS
//         |----------------------------------------------------------------------
//         */

//         builder

//             .addCase(
//                 fetchBookings.pending,
//                 (state) => {
//                     state.listLoading = true;
//                     state.loading = true;
//                     state.error = null;
//                 }
//             )

//             .addCase(
//                 fetchBookings.fulfilled,
//                 (state, action) => {
//                     state.listLoading = false;
//                     state.loading = false;

//                     state.bookings =
//                         action.payload.bookings ||
//                         [];

//                     state.pagination =
//                         action.payload.pagination ||
//                         {
//                             total: 0,
//                             page: 1,
//                             limit: 20,
//                             totalPages: 0,
//                         };

//                     state.error = null;
//                 }
//             )

//             .addCase(
//                 fetchBookings.rejected,
//                 (state, action) => {
//                     state.listLoading = false;
//                     state.loading = false;

//                     state.error =
//                         action.payload ||
//                         "Unable to load bookings.";

//                     state.bookings = [];
//                 }
//             );


//         /*
//         |----------------------------------------------------------------------
//         | FETCH SINGLE BOOKING
//         |----------------------------------------------------------------------
//         */

//         builder

//             .addCase(
//                 fetchBooking.pending,
//                 (state) => {
//                     state.detailsLoading = true;
//                     state.error = null;
//                 }
//             )

//             .addCase(
//                 fetchBooking.fulfilled,
//                 (state, action) => {
//                     state.detailsLoading = false;

//                     state.selectedBooking =
//                         action.payload.booking ||
//                         null;

//                     state.error = null;
//                 }
//             )

//             .addCase(
//                 fetchBooking.rejected,
//                 (state, action) => {
//                     state.detailsLoading = false;

//                     state.error =
//                         action.payload ||
//                         "Unable to load booking.";
//                 }
//             );


//         /*
//         |----------------------------------------------------------------------
//         | CREATE BOOKING
//         |----------------------------------------------------------------------
//         */

//         builder

//             .addCase(
//                 createBookingThunk.pending,
//                 (state) => {
//                     state.mutationLoading = true;
//                     state.mutationError = null;
//                     state.successMessage = null;
//                 }
//             )

//             .addCase(
//                 createBookingThunk.fulfilled,
//                 (state, action) => {
//                     state.mutationLoading = false;

//                     const booking =
//                         action.payload.booking;

//                     /*
//                     |----------------------------------------------------------
//                     | Add newly created booking to current list.
//                     |----------------------------------------------------------
//                     */

//                     if (booking) {
//                         state.bookings = [
//                             booking,
//                             ...state.bookings,
//                         ];

//                         /*
//                         |------------------------------------------------------
//                         | Keep total approximately synchronized.
//                         |------------------------------------------------------
//                         */

//                         state.pagination.total += 1;
//                     }

//                     state.selectedBooking =
//                         booking || null;

//                     state.successMessage =
//                         action.payload.message ||
//                         "Booking created successfully.";

//                     state.mutationError = null;
//                 }
//             )

//             .addCase(
//                 createBookingThunk.rejected,
//                 (state, action) => {
//                     state.mutationLoading = false;

//                     state.mutationError =
//                         action.payload ||
//                         "Unable to create booking.";
//                 }
//             );


//         /*
//         |----------------------------------------------------------------------
//         | UPDATE BOOKING
//         |----------------------------------------------------------------------
//         */

//         builder

//             .addCase(
//                 updateBookingThunk.pending,
//                 (state) => {
//                     state.mutationLoading = true;
//                     state.mutationError = null;
//                     state.successMessage = null;
//                 }
//             )

//             .addCase(
//                 updateBookingThunk.fulfilled,
//                 (state, action) => {
//                     state.mutationLoading = false;

//                     const updatedBooking =
//                         action.payload.booking;

//                     if (updatedBooking) {

//                         state.selectedBooking =
//                             updatedBooking;


//                         /*
//                         |------------------------------------------------------
//                         | Update booking in current list.
//                         |------------------------------------------------------
//                         */

//                         const index =
//                             state.bookings.findIndex(
//                                 (booking) =>
//                                     booking._id ===
//                                     updatedBooking._id
//                             );

//                         if (index !== -1) {
//                             state.bookings[index] =
//                                 updatedBooking;
//                         }
//                     }

//                     state.successMessage =
//                         action.payload.message ||
//                         "Booking updated successfully.";

//                     state.mutationError = null;
//                 }
//             )

//             .addCase(
//                 updateBookingThunk.rejected,
//                 (state, action) => {
//                     state.mutationLoading = false;

//                     state.mutationError =
//                         action.payload ||
//                         "Unable to update booking.";
//                 }
//             );


//         /*
//         |----------------------------------------------------------------------
//         | CANCEL BOOKING
//         |----------------------------------------------------------------------
//         */

//         builder

//             .addCase(
//                 cancelBookingThunk.pending,
//                 (state) => {
//                     state.mutationLoading = true;
//                     state.mutationError = null;
//                     state.successMessage = null;
//                 }
//             )

//             .addCase(
//                 cancelBookingThunk.fulfilled,
//                 (state, action) => {
//                     state.mutationLoading = false;

//                     const cancelledBooking =
//                         action.payload.booking;


//                     if (cancelledBooking) {

//                         state.selectedBooking =
//                             cancelledBooking;


//                         const index =
//                             state.bookings.findIndex(
//                                 (booking) =>
//                                     booking._id ===
//                                     cancelledBooking._id
//                             );


//                         if (index !== -1) {
//                             state.bookings[index] =
//                                 cancelledBooking;
//                         }
//                     }


//                     state.successMessage =
//                         action.payload.message ||
//                         "Booking cancelled successfully.";

//                     state.mutationError = null;
//                 }
//             )

//             .addCase(
//                 cancelBookingThunk.rejected,
//                 (state, action) => {
//                     state.mutationLoading = false;

//                     state.mutationError =
//                         action.payload ||
//                         "Unable to cancel booking.";
//                 }
//             );


//         /*
//         |----------------------------------------------------------------------
//         | CHECK AVAILABILITY
//         |----------------------------------------------------------------------
//         */

//         builder

//             .addCase(
//                 checkAvailabilityThunk.pending,
//                 (state) => {
//                     state.availabilityLoading =
//                         true;

//                     state.availabilityError =
//                         null;

//                     state.availability = {
//                         available: false,
//                         table: null,
//                         endTime: null,
//                         reason: null,
//                     };
//                 }
//             )

//             .addCase(
//                 checkAvailabilityThunk.fulfilled,
//                 (state, action) => {
//                     state.availabilityLoading =
//                         false;


//                     state.availability = {
//                         available:
//                             Boolean(
//                                 action.payload
//                                     .available
//                             ),

//                         table:
//                             action.payload.table ||
//                             null,

//                         endTime:
//                             action.payload.endTime ||
//                             null,

//                         reason:
//                             action.payload.reason ||
//                             null,
//                     };


//                     state.availabilityError =
//                         null;
//                 }
//             )

//             .addCase(
//                 checkAvailabilityThunk.rejected,
//                 (state, action) => {
//                     state.availabilityLoading =
//                         false;

//                     state.availabilityError =
//                         action.payload ||
//                         "Unable to check availability.";
//                 }
//             );
//     },
// });


// /*
// |--------------------------------------------------------------------------
// | Actions
// |--------------------------------------------------------------------------
// */

// export const {
//     setBookingFilters,
//     setBookingFilter,
//     clearBookingFilters,
//     setSelectedBooking,
//     clearSelectedBooking,
//     clearAvailability,
//     clearBookingErrors,
//     clearBookingSuccess,
// } = bookingSlice.actions;


// /*
// |--------------------------------------------------------------------------
// | Selectors
// |--------------------------------------------------------------------------
// */

// export const selectBookings = (
//     state
// ) => state.booking.bookings;

// export const selectSelectedBooking = (
//     state
// ) => state.booking.selectedBooking;

// export const selectBookingPagination = (
//     state
// ) => state.booking.pagination;

// export const selectBookingFilters = (
//     state
// ) => state.booking.filters;

// export const selectBookingLoading = (
//     state
// ) => state.booking.listLoading;

// export const selectBookingDetailsLoading = (
//     state
// ) => state.booking.detailsLoading;

// export const selectBookingMutationLoading = (
//     state
// ) => state.booking.mutationLoading;

// export const selectBookingError = (
//     state
// ) => state.booking.error;

// export const selectBookingMutationError = (
//     state
// ) => state.booking.mutationError;

// export const selectBookingAvailability = (
//     state
// ) => state.booking.availability;

// export const selectBookingAvailabilityLoading = (
//     state
// ) => state.booking.availabilityLoading;

// export const selectBookingAvailabilityError = (
//     state
// ) => state.booking.availabilityError;

// export const selectBookingSuccessMessage = (
//     state
// ) => state.booking.successMessage;


// /*
// |--------------------------------------------------------------------------
// | Default Export
// |--------------------------------------------------------------------------
// */

// export default bookingSlice.reducer;