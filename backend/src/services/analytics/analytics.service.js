import Booking from "../../models/Booking.js";
import Customer from "../../models/Customer.js";
import Table from "../../models/Table.js";

/*
|--------------------------------------------------------------------------
| Analytics Service
|--------------------------------------------------------------------------
|
| Aggregated operational analytics for the restaurant dashboard.
|
| Data sources:
|
| Booking
| Customer
| Table
|
| Supported:
|
| - Booking totals
| - Guest totals
| - Booking status breakdown
| - Booking source breakdown
| - Payment status breakdown
| - Daily booking trend
| - Daily guest trend
| - Table status summary
| - Customer totals
|
|--------------------------------------------------------------------------
*/

const BOOKING_STATUSES = [
    "pending",
    "confirmed",
    "seated",
    "completed",
    "cancelled",
    "no_show",
];

const BOOKING_SOURCES = [
    "ai_voice",
    "dashboard",
    "walk_in",
    "website",
    "whatsapp",
];

const PAYMENT_STATUSES = [
    "pending",
    "paid",
    "refunded",
    "not_required",
];


/*
|--------------------------------------------------------------------------
| Date Helpers
|--------------------------------------------------------------------------
*/

/**
 * Convert YYYY-MM-DD into start of day.
 *
 * Asia/Kolkata is used for dashboard reporting.
 */
const createStartDate = (value) => {
    const date = new Date(`${value}T00:00:00+05:30`);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
};


/**
 * Convert YYYY-MM-DD into end of day.
 */
const createEndDate = (value) => {
    const date = new Date(`${value}T23:59:59.999+05:30`);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
};


/**
 * Format date into YYYY-MM-DD.
 */
const formatDateInput = (date) => {
    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


/*
|--------------------------------------------------------------------------
| Build Default Date Range
|--------------------------------------------------------------------------
*/

const getDefaultDateRange = () => {
    const today = new Date();

    const start = new Date(
        today
    );

    start.setDate(
        start.getDate() - 6
    );

    return {
        from:
            formatDateInput(start),

        to:
            formatDateInput(today),
    };
};


/*
|--------------------------------------------------------------------------
| Validate Date Range
|--------------------------------------------------------------------------
*/

export const normalizeAnalyticsDateRange = ({
    from,
    to,
} = {}) => {

    const defaults =
        getDefaultDateRange();

    const normalizedFrom =
        from || defaults.from;

    const normalizedTo =
        to || defaults.to;

    const startDate =
        createStartDate(
            normalizedFrom
        );

    const endDate =
        createEndDate(
            normalizedTo
        );

    if (!startDate) {
        throw new Error(
            "Invalid analytics start date."
        );
    }

    if (!endDate) {
        throw new Error(
            "Invalid analytics end date."
        );
    }

    if (
        startDate.getTime() >
        endDate.getTime()
    ) {
        throw new Error(
            "Analytics start date cannot be after the end date."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent excessively large reporting windows
    |--------------------------------------------------------------------------
    */

    const difference =
        endDate.getTime() -
        startDate.getTime();

    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

    if (days > 366) {
        throw new Error(
            "Analytics date range cannot exceed 366 days."
        );
    }

    return {
        from:
            normalizedFrom,

        to:
            normalizedTo,

        startDate,

        endDate,
    };
};


/*
|--------------------------------------------------------------------------
| Get Analytics Overview
|--------------------------------------------------------------------------
*/

export const getAnalyticsOverview = async ({
    from,
    to,
} = {}) => {

    const {
        from: normalizedFrom,
        to: normalizedTo,
        startDate,
        endDate,
    } = normalizeAnalyticsDateRange({
        from,
        to,
    });


    /*
    |--------------------------------------------------------------------------
    | Base Booking Query
    |--------------------------------------------------------------------------
    */

    const bookingQuery = {
        isDeleted: false,

        bookingDate: {
            $gte: startDate,
            $lte: endDate,
        },
    };


    /*
    |--------------------------------------------------------------------------
    | Parallel Database Operations
    |--------------------------------------------------------------------------
    */

    const [
        bookingSummary,

        statusBreakdown,

        sourceBreakdown,

        paymentBreakdown,

        dailyTrend,

        tableSummary,

        customerSummary,

        totalCustomers,
    ] = await Promise.all([

        /*
        |----------------------------------------------------------------------
        | Booking Summary
        |----------------------------------------------------------------------
        */

        Booking.aggregate([
            {
                $match:
                    bookingQuery,
            },

            {
                $group: {
                    _id: null,

                    totalBookings: {
                        $sum: 1,
                    },

                    totalGuests: {
                        $sum:
                            "$guestCount",
                    },

                    completedBookings: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "completed",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    confirmedBookings: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "confirmed",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    cancelledBookings: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "cancelled",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    noShowBookings: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "no_show",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },

            {
                $project: {
                    _id: 0,

                    totalBookings: 1,

                    totalGuests: 1,

                    completedBookings: 1,

                    confirmedBookings: 1,

                    cancelledBookings: 1,

                    noShowBookings: 1,
                },
            },
        ]),


        /*
        |----------------------------------------------------------------------
        | Status Breakdown
        |----------------------------------------------------------------------
        */

        Booking.aggregate([
            {
                $match:
                    bookingQuery,
            },

            {
                $group: {
                    _id: "$status",

                    count: {
                        $sum: 1,
                    },

                    guests: {
                        $sum:
                            "$guestCount",
                    },
                },
            },

            {
                $sort: {
                    count: -1,
                },
            },
        ]),


        /*
        |----------------------------------------------------------------------
        | Booking Source Breakdown
        |----------------------------------------------------------------------
        */

        Booking.aggregate([
            {
                $match:
                    bookingQuery,
            },

            {
                $group: {
                    _id:
                        "$bookingSource",

                    count: {
                        $sum: 1,
                    },

                    guests: {
                        $sum:
                            "$guestCount",
                    },
                },
            },

            {
                $sort: {
                    count: -1,
                },
            },
        ]),


        /*
        |----------------------------------------------------------------------
        | Payment Status Breakdown
        |----------------------------------------------------------------------
        */

        Booking.aggregate([
            {
                $match:
                    bookingQuery,
            },

            {
                $group: {
                    _id:
                        "$paymentStatus",

                    count: {
                        $sum: 1,
                    },
                },
            },

            {
                $sort: {
                    count: -1,
                },
            },
        ]),


        /*
        |----------------------------------------------------------------------
        | Daily Booking Trend
        |----------------------------------------------------------------------
        |
        | Dashboard reporting is based on Asia/Kolkata.
        |
        */

        Booking.aggregate([
            {
                $match:
                    bookingQuery,
            },

            {
                $group: {
                    _id: {
                        $dateToString: {
                            format:
                                "%Y-%m-%d",

                            date:
                                "$bookingDate",

                            timezone:
                                "Asia/Kolkata",
                        },
                    },

                    bookings: {
                        $sum: 1,
                    },

                    guests: {
                        $sum:
                            "$guestCount",
                    },
                },
            },

            {
                $sort: {
                    _id: 1,
                },
            },
        ]),


        /*
        |----------------------------------------------------------------------
        | Current Table Summary
        |----------------------------------------------------------------------
        */

        Table.aggregate([
            {
                $match: {
                    isDeleted: false,
                },
            },

            {
                $group: {
                    _id: "$status",

                    count: {
                        $sum: 1,
                    },
                },
            },

            {
                $sort: {
                    _id: 1,
                },
            },
        ]),


        /*
        |----------------------------------------------------------------------
        | Customer Summary
        |----------------------------------------------------------------------
        */

        Customer.aggregate([
            {
                $match: {
                    isDeleted: false,
                },
            },

            {
                $group: {
                    _id: null,

                    totalCustomers: {
                        $sum: 1,
                    },

                    blockedCustomers: {
                        $sum: {
                            $cond: [
                                "$isBlocked",
                                1,
                                0,
                            ],
                        },
                    },

                    totalVisits: {
                        $sum:
                            "$totalVisits",
                    },

                    totalCustomerBookings: {
                        $sum:
                            "$totalBookings",
                    },
                },
            },

            {
                $project: {
                    _id: 0,

                    totalCustomers: 1,

                    blockedCustomers: 1,

                    totalVisits: 1,

                    totalCustomerBookings: 1,
                },
            },
        ]),


        /*
        |----------------------------------------------------------------------
        | Total Customers
        |----------------------------------------------------------------------
        */

        Customer.countDocuments({
            isDeleted: false,
        }),
    ]);


    /*
    |--------------------------------------------------------------------------
    | Normalize Summary
    |--------------------------------------------------------------------------
    */

    const summary =
        bookingSummary[0] || {
            totalBookings: 0,
            totalGuests: 0,
            completedBookings: 0,
            confirmedBookings: 0,
            cancelledBookings: 0,
            noShowBookings: 0,
        };


    /*
    |--------------------------------------------------------------------------
    | Normalize Status Breakdown
    |--------------------------------------------------------------------------
    */

    const statusMap =
        Object.fromEntries(
            statusBreakdown.map(
                (item) => [
                    item._id,
                    {
                        count:
                            item.count,

                        guests:
                            item.guests,
                    },
                ]
            )
        );


    const statuses =
        BOOKING_STATUSES.map(
            (status) => ({
                status,

                count:
                    statusMap[
                        status
                    ]?.count || 0,

                guests:
                    statusMap[
                        status
                    ]?.guests || 0,
            })
        );


    /*
    |--------------------------------------------------------------------------
    | Normalize Sources
    |--------------------------------------------------------------------------
    */

    const sourceMap =
        Object.fromEntries(
            sourceBreakdown.map(
                (item) => [
                    item._id,
                    {
                        count:
                            item.count,

                        guests:
                            item.guests,
                    },
                ]
            )
        );


    const sources =
        BOOKING_SOURCES.map(
            (source) => ({
                source,

                count:
                    sourceMap[
                        source
                    ]?.count || 0,

                guests:
                    sourceMap[
                        source
                    ]?.guests || 0,
            })
        );


    /*
    |--------------------------------------------------------------------------
    | Normalize Payments
    |--------------------------------------------------------------------------
    */

    const paymentMap =
        Object.fromEntries(
            paymentBreakdown.map(
                (item) => [
                    item._id,
                    item.count,
                ]
            )
        );


    const payments =
        PAYMENT_STATUSES.map(
            (status) => ({
                status,

                count:
                    paymentMap[
                        status
                    ] || 0,
            })
        );


    /*
    |--------------------------------------------------------------------------
    | Normalize Tables
    |--------------------------------------------------------------------------
    */

    const tableStatusMap =
        Object.fromEntries(
            tableSummary.map(
                (item) => [
                    item._id,
                    item.count,
                ]
            )
        );


    /*
    |--------------------------------------------------------------------------
    | Customer Summary
    |--------------------------------------------------------------------------
    */

    const customers =
        customerSummary[0] || {
            totalCustomers:
                totalCustomers,

            blockedCustomers: 0,

            totalVisits: 0,

            totalCustomerBookings: 0,
        };


    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return {

        dateRange: {
            from:
                normalizedFrom,

            to:
                normalizedTo,
        },

        bookings: {
            total:
                summary.totalBookings,

            confirmed:
                summary.confirmedBookings,

            completed:
                summary.completedBookings,

            cancelled:
                summary.cancelledBookings,

            noShow:
                summary.noShowBookings,

            guests:
                summary.totalGuests,
        },


        statuses,


        sources,


        payments,


        dailyTrend,


        tables: {

            total:
                Object.values(
                    tableStatusMap
                ).reduce(
                    (
                        total,
                        count
                    ) =>
                        total +
                        count,
                    0
                ),

            available:
                tableStatusMap.Available ||
                0,

            reserved:
                tableStatusMap.Reserved ||
                0,

            occupied:
                tableStatusMap.Occupied ||
                0,

            maintenance:
                tableStatusMap.Maintenance ||
                0,
        },


        customers: {
            total:
                customers.totalCustomers,

            blocked:
                customers.blockedCustomers,

            visits:
                customers.totalVisits,

            bookings:
                customers.totalCustomerBookings,
        },
    };
};