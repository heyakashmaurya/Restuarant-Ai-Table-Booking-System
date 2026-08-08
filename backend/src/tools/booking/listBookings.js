import { listBookings as listBookingsService } from "../../services/booking/listBookings.js";

/*
|--------------------------------------------------------------------------
| List Bookings Tool
|--------------------------------------------------------------------------
|
| Retrieves multiple restaurant bookings using optional filters.
|
| The database/query logic remains inside:
|
| services/booking/listBookings.js
|
| This tool only:
| - accepts tool arguments
| - calls the booking service
| - returns an AI-friendly response
|
|--------------------------------------------------------------------------
*/

export const listBookings = async ({
    bookingDate,
    status,
    customer,
    bookingSource,
    paymentStatus,
    page = 1,
    limit = 20,
} = {}) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | Call Booking Service
        |--------------------------------------------------------------------------
        */

        const result = await listBookingsService({

            bookingDate,

            status,

            customer,

            bookingSource,

            paymentStatus,

            page,

            limit,

        });

        /*
        |--------------------------------------------------------------------------
        | Service Failure
        |--------------------------------------------------------------------------
        */

        if (!result.success) {

            return {

                success: false,

                bookings: [],

                total: 0,

                page: result.page ?? 1,

                limit: result.limit ?? 20,

                totalPages: 0,

                message:
                    result.message ||
                    "Unable to retrieve bookings.",

            };

        }

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return {

            success: true,

            bookings: result.bookings,

            total: result.total,

            page: result.page,

            limit: result.limit,

            totalPages: result.totalPages,

            message:
                result.message ||
                "Bookings retrieved successfully.",

        };

    } catch (error) {

        /*
        |--------------------------------------------------------------------------
        | Error Handling
        |--------------------------------------------------------------------------
        */

        console.error(
            "List Bookings Tool Error:",
            error
        );

        return {

            success: false,

            bookings: [],

            total: 0,

            page: 1,

            limit: 20,

            totalPages: 0,

            message:
                "Unable to retrieve the bookings right now.",

        };

    }

};