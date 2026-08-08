import Booking from "../../models/Booking.js";

/*
|--------------------------------------------------------------------------
| List Bookings Service
|--------------------------------------------------------------------------
|
| Retrieves multiple bookings with optional filters.
|
| Supported filters:
| - bookingDate
| - status
| - customer
| - bookingSource
| - paymentStatus
| - page
| - limit
|
| This service:
| - excludes deleted bookings
| - supports pagination
| - populates customer
| - populates table
| - returns total count
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
        | Build Query
        |--------------------------------------------------------------------------
        */

        const query = {
            isDeleted: false,
        };

        /*
        |--------------------------------------------------------------------------
        | Booking Date Filter
        |--------------------------------------------------------------------------
        */

        if (bookingDate) {

            const date = new Date(bookingDate);

            if (Number.isNaN(date.getTime())) {

                return {
                    success: false,
                    bookings: [],
                    total: 0,
                    page: 1,
                    limit,
                    totalPages: 0,
                    message: "Invalid booking date.",
                };

            }

            /*
            |----------------------------------------------------------------------
            | Create Start & End Of Day
            |----------------------------------------------------------------------
            */

            const startOfDay = new Date(date);

            startOfDay.setHours(
                0,
                0,
                0,
                0
            );

            const endOfDay = new Date(date);

            endOfDay.setHours(
                23,
                59,
                59,
                999
            );

            query.bookingDate = {
                $gte: startOfDay,
                $lte: endOfDay,
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Status Filter
        |--------------------------------------------------------------------------
        */

        if (status) {

            query.status = status;

        }

        /*
        |--------------------------------------------------------------------------
        | Customer Filter
        |--------------------------------------------------------------------------
        */

        if (customer) {

            query.customer = customer;

        }

        /*
        |--------------------------------------------------------------------------
        | Booking Source Filter
        |--------------------------------------------------------------------------
        */

        if (bookingSource) {

            query.bookingSource = bookingSource;

        }

        /*
        |--------------------------------------------------------------------------
        | Payment Status Filter
        |--------------------------------------------------------------------------
        */

        if (paymentStatus) {

            query.paymentStatus = paymentStatus;

        }

        /*
        |--------------------------------------------------------------------------
        | Validate Pagination
        |--------------------------------------------------------------------------
        */

        let currentPage = Number(page);

        let currentLimit = Number(limit);

        if (
            !Number.isInteger(currentPage) ||
            currentPage < 1
        ) {
            currentPage = 1;
        }

        if (
            !Number.isInteger(currentLimit) ||
            currentLimit < 1
        ) {
            currentLimit = 20;
        }

        /*
        |--------------------------------------------------------------------------
        | Maximum Limit
        |--------------------------------------------------------------------------
        |
        | Prevent extremely large queries.
        |
        */

        if (currentLimit > 100) {

            currentLimit = 100;

        }

        const skip =
            (currentPage - 1) * currentLimit;

        /*
        |--------------------------------------------------------------------------
        | Count Bookings
        |--------------------------------------------------------------------------
        */

        const total =
            await Booking.countDocuments(query);

        /*
        |--------------------------------------------------------------------------
        | Fetch Bookings
        |--------------------------------------------------------------------------
        */

        const bookings =
            await Booking.find(query)
                .populate("customer")
                .populate("table")
                .sort({
                    bookingDate: 1,
                    startTime: 1,
                    createdAt: -1,
                })
                .skip(skip)
                .limit(currentLimit);

        /*
        |--------------------------------------------------------------------------
        | Calculate Total Pages
        |--------------------------------------------------------------------------
        */

        const totalPages =
            Math.ceil(total / currentLimit);

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return {

            success: true,

            bookings,

            total,

            page: currentPage,

            limit: currentLimit,

            totalPages,

            message: "Bookings retrieved successfully.",

        };

    } catch (error) {

        /*
        |--------------------------------------------------------------------------
        | Error Handling
        |--------------------------------------------------------------------------
        */

        console.error(
            "List Bookings Error:",
            error
        );

        throw error;

    }
};