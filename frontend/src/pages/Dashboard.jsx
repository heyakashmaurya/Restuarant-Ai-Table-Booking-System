import {
    ArrowRight,
    CalendarCheck,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MoreHorizontal,
    Plus,
    RefreshCw,
    Table2,
    Users,
    UtensilsCrossed,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchBookings,
    selectBookings,
    selectBookingLoading,
    selectBookingPagination,
} from "../features/bookingSlice.js";

import {
    fetchTables,
    selectTables,
    selectTableLoading,
} from "../features/tableSlice.js";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
|
| Main restaurant operations dashboard.
|
| Important:
| This component intentionally does not contain hard-coded database
| records. The values below are UI defaults until the booking/table
| Redux state and API integration are connected.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Temporary dashboard configuration
|--------------------------------------------------------------------------
|
| These values represent display structure only.
| They should be replaced with Redux/API data in the next integration step.
|--------------------------------------------------------------------------
*/

// const dashboardStats = [
//     {
//         title: "Today's Reservations",
//         value: "0",
//         description: "Reservations scheduled today",
//         icon: CalendarCheck,
//         iconClass: "bg-blue-50 text-blue-600",
//     },
//     {
//         title: "Confirmed",
//         value: "0",
//         description: "Confirmed reservations",
//         icon: CheckCircle2,
//         iconClass: "bg-emerald-50 text-emerald-600",
//     },
//     {
//         title: "Guests Today",
//         value: "0",
//         description: "Expected guests",
//         icon: Users,
//         iconClass: "bg-violet-50 text-violet-600",
//     },
//     {
//         title: "Available Tables",
//         value: "0",
//         description: "Tables currently available",
//         icon: Table2,
//         iconClass: "bg-amber-50 text-amber-600",
//     },
// ];

// /*
// |--------------------------------------------------------------------------
// | Empty collections
// |--------------------------------------------------------------------------
// |
// | These will later come from Redux selectors.
// |--------------------------------------------------------------------------
// */

// const upcomingReservations = [];

// const recentBookings = [];

// const tableSummary = {
//     total: 0,
//     available: 0,
//     reserved: 0,
//     occupied: 0,
// };




const Dashboard = () => {

    const dispatch = useDispatch();

    const bookings = useSelector(selectBookings);
    const bookingLoading = useSelector(selectBookingLoading);

    const tables = useSelector(selectTables);
    const tableLoading = useSelector(selectTableLoading);

    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        dispatch(
            fetchBookings({
                page: 1,
                limit: 100,
            })
        );

        dispatch(
            fetchTables()
        );
    }, [dispatch]);
    /*
    |--------------------------------------------------------------------------
    | Current date
    |--------------------------------------------------------------------------
    */

    // const today = useMemo(() => {
    //     const date = new Date();

    //     return date.toISOString().slice(0, 10);
    // }, []);
    const today = useMemo(() => {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }, []);

    const currentDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date());



    const todaysBookings = useMemo(() => {
        return bookings.filter((booking) => {
            if (!booking?.bookingDate) {
                return false;
            }

            const bookingDate = new Date(
                booking.bookingDate
            );

            const bookingDay =
                bookingDate.toISOString().slice(0, 10);

            return (
                bookingDay === today &&
                booking.isDeleted !== true
            );
        });
    }, [bookings, today]);

    const confirmedBookings = useMemo(() => {
        return todaysBookings.filter(
            (booking) =>
                booking?.status?.toLowerCase() === "confirmed"
        );
    }, [todaysBookings]);


    const todaysGuests = useMemo(() => {
        return todaysBookings.reduce(
            (total, booking) =>
                total + Number(booking?.guestCount || 0),
            0
        );
    }, [todaysBookings]);


    const tableSummary = useMemo(() => {
        const summary = {
            total: tables.length,
            available: 0,
            reserved: 0,
            occupied: 0,
        };

        tables.forEach((table) => {
            const status =
                table?.status?.toLowerCase();

            if (status === "available") {
                summary.available += 1;
            }

            if (status === "reserved") {
                summary.reserved += 1;
            }

            if (status === "occupied") {
                summary.occupied += 1;
            }
        });

        return summary;
    }, [tables]);

    const dashboardStats = [
        {
            title: "Today's Reservations",
            value: todaysBookings.length,
            description: "Reservations scheduled today",
            icon: CalendarCheck,
            iconClass: "bg-blue-50 text-blue-600",
        },

        {
            title: "Confirmed",
            value: confirmedBookings.length,
            description: "Confirmed reservations",
            icon: CheckCircle2,
            iconClass: "bg-emerald-50 text-emerald-600",
        },

        {
            title: "Guests Today",
            value: todaysGuests,
            description: "Expected guests",
            icon: Users,
            iconClass: "bg-violet-50 text-violet-600",
        },

        {
            title: "Available Tables",
            value: tableSummary.available,
            description: "Tables currently available",
            icon: Table2,
            iconClass: "bg-amber-50 text-amber-600",
        },
    ];



    const upcomingReservations = useMemo(() => {
        return todaysBookings
            .filter((booking) => {
                return (
                    booking?.status !== "cancelled" &&
                    booking?.status !== "completed" &&
                    booking?.status !== "no_show"
                );
            })
            .sort((a, b) => {
                return String(
                    a?.startTime || ""
                ).localeCompare(
                    String(
                        b?.startTime || ""
                    )
                );
            })
            .map((booking) => ({
                id:
                    booking?._id ||
                    booking?.id,

                customerName:
                    booking?.customer?.fullName ||
                    booking?.name ||
                    "Unknown customer",

                tableNumber:
                    booking?.table?.tableNumber ||
                    "—",

                guestCount:
                    booking?.guestCount || 0,

                startTime:
                    booking?.startTime || "—",

                status:
                    booking?.status || "pending",
            }));
    }, [todaysBookings]);


    const formatDashboardDate = (value) => {
        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            }
        ).format(date);
    };
    
    const recentBookings = useMemo(() => {
        return [...bookings]
            .filter(
                (booking) =>
                    booking?.isDeleted !== true
            )
            .sort((a, b) => {
                return (
                    new Date(
                        b?.updatedAt ||
                        b?.createdAt ||
                        0
                    ) -
                    new Date(
                        a?.updatedAt ||
                        a?.createdAt ||
                        0
                    )
                );
            })
            .slice(0, 5)
            .map((booking) => ({
                id:
                    booking?._id ||
                    booking?.id,

                description:
                    `${booking?.customer?.fullName || "Unknown customer"} booking ${booking?.status || ""}`,

                time:
                    formatDashboardDate(
                        booking?.updatedAt ||
                        booking?.createdAt
                    ),

                status:
                    booking?.status,
            }));
    }, [bookings]);




    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            await Promise.all([
                dispatch(
                    fetchBookings({
                        page: 1,
                        limit: 100,
                    })
                ).unwrap(),

                dispatch(
                    fetchTables()
                ).unwrap(),
            ]);
        } catch (error) {
            console.error(
                "Dashboard refresh error:",
                error
            );
        } finally {
            setRefreshing(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-8">

            {/* =========================================================
                Page Header
            ========================================================= */}

            <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays className="h-4 w-4" />

                        <span>{currentDate}</span>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        Good morning, Administrator
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        Here is your restaurant's booking and table overview
                        for today.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-700
                            shadow-sm
                            transition
                            hover:border-slate-300
                            hover:bg-slate-50
                        "
                    >
                        {/* <RefreshCw className="h-4 w-4" /> */}
                        <RefreshCw
                            className={`h-4 w-4 ${refreshing
                                ? "animate-spin"
                                : ""
                                }`}
                        />

                        Refresh
                    </button>

                    <Link
                        to="/reservations"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-blue-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:ring-offset-2
                        "
                    >
                        <Plus className="h-4 w-4" />

                        New Reservation
                    </Link>

                </div>

            </section>

            {/* =========================================================
                KPI Cards
            ========================================================= */}

            <section
                aria-label="Booking statistics"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >

                {dashboardStats.map((stat) => {

                    const Icon = stat.icon;

                    return (
                        <article
                            key={stat.title}
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-md
                            "
                        >

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {stat.title}
                                    </p>

                                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                                        {stat.value}
                                    </p>
                                </div>

                                <div
                                    className={`
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        ${stat.iconClass}
                                    `}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-slate-500">
                                {stat.description}
                            </p>

                        </article>
                    );
                })}

            </section>

            {/* =========================================================
                Main Dashboard Grid
            ========================================================= */}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* =====================================================
                    Today's Reservations
                ===================================================== */}

                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">

                        <div>
                            <h2 className="font-semibold text-slate-950">
                                Today's Reservations
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Upcoming bookings for today
                            </p>
                        </div>

                        <Link
                            to="/reservations"
                            className="
                                inline-flex
                                items-center
                                gap-1
                                text-sm
                                font-semibold
                                text-blue-600
                                transition
                                hover:text-blue-700
                            "
                        >
                            View all

                            <ArrowRight className="h-4 w-4" />
                        </Link>

                    </div>

                    {upcomingReservations.length === 0 ? (
                        <EmptyState
                            icon={CalendarDays}
                            title="No reservations yet"
                            description="Today's upcoming reservations will appear here."
                            actionLabel="View reservations"
                            actionTo="/reservations"
                        />
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {upcomingReservations.map((reservation) => (
                                <ReservationRow
                                    key={reservation.id}
                                    reservation={reservation}
                                />
                            ))}
                        </div>
                    )}

                </article>

                {/* =====================================================
                    Table Overview
                ===================================================== */}

                <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                        <div>
                            <h2 className="font-semibold text-slate-950">
                                Table Overview
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Current table status
                            </p>
                        </div>

                        <Link
                            to="/tables"
                            className="
                                rounded-lg
                                p-2
                                text-slate-400
                                transition
                                hover:bg-slate-100
                                hover:text-slate-700
                            "
                            aria-label="View tables"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                    </div>

                    <div className="p-5">

                        <div className="flex items-center justify-center py-4">

                            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-slate-100">

                                <div className="text-center">
                                    <p className="text-3xl font-bold text-slate-950">
                                        {tableSummary.total}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Total tables
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div className="mt-5 space-y-3">

                            <TableStatus
                                label="Available"
                                value={tableSummary.available}
                                dotClass="bg-emerald-500"
                            />

                            <TableStatus
                                label="Reserved"
                                value={tableSummary.reserved}
                                dotClass="bg-blue-500"
                            />

                            <TableStatus
                                label="Occupied"
                                value={tableSummary.occupied}
                                dotClass="bg-amber-500"
                            />

                        </div>

                    </div>

                </article>

            </section>

            {/* =========================================================
                Bottom Dashboard Grid
            ========================================================= */}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* =====================================================
                    Recent Booking Activity
                ===================================================== */}

                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">

                        <div>
                            <h2 className="font-semibold text-slate-950">
                                Recent Booking Activity
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Latest reservation activity
                            </p>
                        </div>

                        <Link
                            to="/reservations"
                            className="
                                text-sm
                                font-semibold
                                text-blue-600
                                hover:text-blue-700
                            "
                        >
                            View all
                        </Link>

                    </div>

                    {recentBookings.length === 0 ? (
                        <EmptyState
                            icon={Clock3}
                            title="No recent activity"
                            description="New booking activity will appear here."
                        />
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentBookings.map((booking) => (
                                <BookingActivityRow
                                    key={booking.id}
                                    booking={booking}
                                />
                            ))}
                        </div>
                    )}

                </article>

                {/* =====================================================
                    Quick Actions
                ===================================================== */}

                <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-5 py-4">

                        <h2 className="font-semibold text-slate-950">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Common restaurant operations
                        </p>

                    </div>

                    <div className="grid gap-3 p-5">

                        <QuickAction
                            to="/reservations"
                            icon={Plus}
                            title="Create Reservation"
                            description="Add a new guest booking"
                        />

                        <QuickAction
                            to="/reservations"
                            icon={CalendarCheck}
                            title="Manage Reservations"
                            description="View and manage bookings"
                        />

                        <QuickAction
                            to="/tables"
                            icon={Table2}
                            title="Manage Tables"
                            description="Check table availability"
                        />

                        <QuickAction
                            to="/calls"
                            icon={UtensilsCrossed}
                            title="View Call Logs"
                            description="Review AI booking calls"
                        />

                    </div>

                </article>

            </section>

        </div>
    );
};

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionTo,
}) => {
    return (
        <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <Icon className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {title}
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                {description}
            </p>

            {actionLabel && actionTo && (
                <Link
                    to={actionTo}
                    className="
                        mt-4
                        text-sm
                        font-semibold
                        text-blue-600
                        hover:text-blue-700
                    "
                >
                    {actionLabel}
                </Link>
            )}

        </div>
    );
};

/*
|--------------------------------------------------------------------------
| Reservation Row
|--------------------------------------------------------------------------
*/

const ReservationRow = ({ reservation }) => {
    return (
        <div className="flex items-center gap-4 px-5 py-4 sm:px-6">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-slate-900">
                    {reservation.customerName}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    Table {reservation.tableNumber}
                    {" · "}
                    {reservation.guestCount} guests
                </p>

            </div>

            <div className="text-right">

                <p className="text-sm font-semibold text-slate-900">
                    {reservation.startTime}
                </p>

                <p className="mt-1 text-xs text-emerald-600">
                    {reservation.status}
                </p>

            </div>

            <button
                type="button"
                aria-label={`More options for ${reservation.customerName}`}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>

        </div>
    );
};

/*
|--------------------------------------------------------------------------
| Booking Activity Row
|--------------------------------------------------------------------------
*/

const BookingActivityRow = ({ booking }) => {
    return (
        <div className="flex items-center gap-4 px-5 py-4 sm:px-6">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <CalendarCheck className="h-4 w-4 text-slate-500" />
            </div>

            <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-medium text-slate-900">
                    {booking.description}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    {booking.time}
                </p>

            </div>

            <StatusBadge status={booking.status} />

        </div>
    );
};

/*
|--------------------------------------------------------------------------
| Table Status
|--------------------------------------------------------------------------
*/

const TableStatus = ({
    label,
    value,
    dotClass,
}) => {
    return (
        <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

                <span
                    className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
                />

                <span className="text-sm text-slate-600">
                    {label}
                </span>

            </div>

            <span className="text-sm font-semibold text-slate-900">
                {value}
            </span>

        </div>
    );
};

/*
|--------------------------------------------------------------------------
| Quick Action
|--------------------------------------------------------------------------
*/

const QuickAction = ({
    to,
    icon: Icon,
    title,
    description,
}) => {
    return (
        <Link
            to={to}
            className="
                group
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200
                p-3
                transition
                hover:border-blue-200
                hover:bg-blue-50/50
            "
        >

            <div className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-slate-100
                text-slate-600
                transition
                group-hover:bg-blue-100
                group-hover:text-blue-600
            ">
                <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">

                <p className="text-sm font-semibold text-slate-900">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                    {description}
                </p>

            </div>

            <ArrowRight
                className="
                    h-4
                    w-4
                    shrink-0
                    text-slate-300
                    transition
                    group-hover:translate-x-0.5
                    group-hover:text-blue-500
                "
            />

        </Link>
    );
};

/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

const StatusBadge = ({ status }) => {

    const normalizedStatus = status?.toLowerCase();

    const statusStyles = {
        confirmed: "bg-emerald-50 text-emerald-700",
        pending: "bg-amber-50 text-amber-700",
        cancelled: "bg-red-50 text-red-700",
        seated: "bg-blue-50 text-blue-700",
        completed: "bg-slate-100 text-slate-700",
        no_show: "bg-red-50 text-red-700",
    };

    const className =
        statusStyles[normalizedStatus] ||
        "bg-slate-100 text-slate-600";

    return (
        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-[11px]
                font-semibold
                capitalize
                ${className}
            `}
        >
            {status?.replace("_", " ") || "Unknown"}
        </span>
    );
};

export default Dashboard;