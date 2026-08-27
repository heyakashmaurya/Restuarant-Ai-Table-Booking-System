
import api from "./api.js";

/*
|--------------------------------------------------------------------------
| Booking API Service
|--------------------------------------------------------------------------
|
| All dashboard booking HTTP requests live here.
|
| Components/pages should NOT call axios directly.
|
| Dashboard
|    ↓
| bookingSlice
|    ↓
| bookingApi
|    ↓
| api.js
|    ↓
| Backend
|
|--------------------------------------------------------------------------
*/

const BOOKING_BASE_URL = "/bookings";


/*
|--------------------------------------------------------------------------
| Get Bookings
|--------------------------------------------------------------------------
|
| GET /api/bookings
|
| Supported filters:
|
| bookingDate
| status
| customer
| bookingSource
| paymentStatus
| page
| limit
|
|--------------------------------------------------------------------------
*/

export const getBookings = async ({
    bookingDate,
    status,
    customer,
    bookingSource,
    paymentStatus,
    page = 1,
    limit = 20,
} = {}) => {

    const params = {
        page,
        limit,
    };


    /*
    |----------------------------------------------------------------------
    | Optional Filters
    |----------------------------------------------------------------------
    */

    if (bookingDate) {
        params.bookingDate = bookingDate;
    }

    if (status) {
        params.status = status;
    }

    if (customer) {
        params.customer = customer;
    }

    if (bookingSource) {
        params.bookingSource = bookingSource;
    }

    if (paymentStatus) {
        params.paymentStatus = paymentStatus;
    }


    const response = await api.get(
        BOOKING_BASE_URL,
        {
            params,
        }
    );


    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Booking
|--------------------------------------------------------------------------
|
| GET /api/bookings/:id
|
|--------------------------------------------------------------------------
*/

export const getBooking = async (bookingId) => {

    if (!bookingId) {
        throw new Error(
            "Booking ID is required."
        );
    }


    const response = await api.get(
        `${BOOKING_BASE_URL}/${bookingId}`
    );


    return response.data;
};


/*
|--------------------------------------------------------------------------
| Check Booking Availability
|--------------------------------------------------------------------------
|
| GET /api/bookings/availability
|
|--------------------------------------------------------------------------
*/

export const checkAvailability = async ({
    bookingDate,
    startTime,
    guestCount,
    excludeBookingId,
} = {}) => {

    if (!bookingDate) {
        throw new Error(
            "Booking date is required."
        );
    }

    if (!startTime) {
        throw new Error(
            "Booking time is required."
        );
    }

    if (
        guestCount === undefined ||
        guestCount === null
    ) {
        throw new Error(
            "Guest count is required."
        );
    }

    const payload = {
        bookingDate,
        startTime,
        guestCount,
    };

    if (excludeBookingId) {
        payload.excludeBookingId =
            excludeBookingId;
    }

    const response = await api.post(
        `${BOOKING_BASE_URL}/availability`,
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Create Booking
|--------------------------------------------------------------------------
|
| POST /api/bookings
|
|--------------------------------------------------------------------------
*/

export const createBooking = async ({
    name,
    phone,
    email = "",
    bookingDate,
    startTime,
    guestCount,
    specialRequest = "",
    occasion = "",
    notes = "",
    bookingSource = "dashboard",
} = {}) => {

    const payload = {
        name,
        phone,
        email,

        bookingDate,
        startTime,
        guestCount,

        specialRequest,
        occasion,
        notes,

        bookingSource,
    };


    const response = await api.post(
        `${BOOKING_BASE_URL}/create`,
        payload
    );


    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Booking
|--------------------------------------------------------------------------
|
| PATCH /api/bookings/:id
|
|--------------------------------------------------------------------------
*/

export const updateBooking = async (
    bookingId,
    updates
) => {

    console.log(
        "API updateBooking bookingId:",
        bookingId
    );

    if (!bookingId) {
        throw new Error(
            "Booking ID is required."
        );
    }


    if (
        !updates ||
        typeof updates !== "object"
    ) {
        throw new Error(
            "Booking update data is required."
        );
    }


    const response = await api.patch(
        `${BOOKING_BASE_URL}/${bookingId}`,
        updates
    );


    return response.data;
};


/*
|--------------------------------------------------------------------------
| Cancel Booking
|--------------------------------------------------------------------------
|
| PATCH /api/bookings/:id/cancel
|
|--------------------------------------------------------------------------
*/

export const cancelBooking = async (
    bookingId,
    {
        reason = "Cancelled by dashboard",
        cancelledBy = "admin",
    } = {}
) => {

    if (!bookingId) {
        throw new Error(
            "Booking ID is required."
        );
    }


    const response = await api.patch(
        `${BOOKING_BASE_URL}/${bookingId}/cancel`,
        {
            reason,
            cancelledBy,
        }
    );


    return response.data;
};


/*
|--------------------------------------------------------------------------
| Export Default
|--------------------------------------------------------------------------
*/

const bookingApi = {
    getBookings,
    getBooking,
    checkAvailability,
    createBooking,
    updateBooking,
    cancelBooking,
};

export default bookingApi;



// import api from "./api";


// /*
// |--------------------------------------------------------------------------
// | Booking API
// |--------------------------------------------------------------------------
// |
// | Frontend API layer for:
// |
// | - Creating bookings
// | - Listing bookings
// | - Getting a booking
// | - Checking availability
// | - Updating bookings
// | - Cancelling bookings
// |
// |--------------------------------------------------------------------------
// */


// /*
// |--------------------------------------------------------------------------
// | Create Booking
// |--------------------------------------------------------------------------
// |
// | POST /api/bookings
// |
// */

// export const createBooking = async (payload) => {
//     const response = await api.post(
//         "/bookings/create",
//         payload
//     );

//     return response.data;
// };


// /*
// |--------------------------------------------------------------------------
// | List Bookings
// |--------------------------------------------------------------------------
// |
// | GET /api/bookings
// |
// */

// export const getBookings = async ({
//     bookingDate,
//     status,
//     customer,
//     bookingSource,
//     paymentStatus,
//     page = 1,
//     limit = 20,
// } = {}) => {
//     const params = {};

//     if (bookingDate) {
//         params.bookingDate = bookingDate;
//     }

//     if (status) {
//         params.status = status;
//     }

//     if (customer) {
//         params.customer = customer;
//     }

//     if (bookingSource) {
//         params.bookingSource =
//             bookingSource;
//     }

//     if (paymentStatus) {
//         params.paymentStatus =
//             paymentStatus;
//     }

//     params.page = page;
//     params.limit = limit;


//     const response = await api.get(
//         "/bookings",
//         {
//             params,
//         }
//     );

//     return response.data;
// };


// /*
// |--------------------------------------------------------------------------
// | Get Single Booking
// |--------------------------------------------------------------------------
// |
// | GET /api/bookings/:id
// |
// */

// export const getBooking = async (
//     bookingId
// ) => {
//     const response = await api.get(
//         `/bookings/${bookingId}`
//     );

//     return response.data;
// };


// /*
// |--------------------------------------------------------------------------
// | Check Availability
// |--------------------------------------------------------------------------
// |
// | GET /api/bookings/availability
// |
// */

// export const checkBookingAvailability =
//     async ({
//         bookingDate,
//         startTime,
//         guestCount,
//         excludeBookingId,
//     }) => {
//         const params = {
//             bookingDate,
//             startTime,
//             guestCount,
//         };

//         if (excludeBookingId) {
//             params.excludeBookingId =
//                 excludeBookingId;
//         }


//         const response = await api.get(
//             "/bookings/availability",
//             {
//                 params,
//             }
//         );

//         return response.data;
//     };


// /*
// |--------------------------------------------------------------------------
// | Update Booking
// |--------------------------------------------------------------------------
// |
// | PATCH /api/bookings/:id
// |
// */

// export const updateBooking = async (
//     bookingId,
//     payload
// ) => {
//     const response = await api.patch(
//         `/bookings/${bookingId}`,
//         payload
//     );

//     return response.data;
// };


// /*
// |--------------------------------------------------------------------------
// | Cancel Booking
// |--------------------------------------------------------------------------
// |
// | PATCH /api/bookings/:id/cancel
// |
// */

// export const cancelBooking = async (
//     bookingId,
//     {
//         reason = "Cancelled by dashboard",
//         cancelledBy = "admin",
//     } = {}
// ) => {
//     const response = await api.patch(
//         `/bookings/${bookingId}/cancel`,
//         {
//             reason,
//             cancelledBy,
//         }
//     );

//     return response.data;
// };