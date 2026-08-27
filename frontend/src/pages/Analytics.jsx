import {
    Activity,
    ArrowDown,
    ArrowUp,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    Clock3,
    RefreshCw,
    Table2,
    TrendingUp,
    Users,
    XCircle,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    fetchAnalytics,
    selectAnalytics,
    selectAnalyticsLoading,
    selectAnalyticsError,
    selectAnalyticsDateRange,
} from "../features/analyticsSlice.js";


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatDateInput = (
    date
) => {

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


const getDefaultRange = () => {

    const today =
        new Date();

    const from =
        new Date(today);

    from.setDate(
        from.getDate() - 6
    );

    return {
        from:
            formatDateInput(from),

        to:
            formatDateInput(today),
    };
};


const formatNumber = (
    value
) => {

    return new Intl.NumberFormat(
        "en-IN"
    ).format(
        Number(value || 0)
    );
};


const formatSource = (
    value
) => {

    if (!value) {
        return "Unknown";
    }

    return value
        .replace(
            /_/g,
            " "
        )
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
};


/*
|--------------------------------------------------------------------------
| Analytics Page
|--------------------------------------------------------------------------
*/

const Analytics = () => {

    const dispatch =
        useDispatch();


    /*
    |--------------------------------------------------------------------------
    | Redux
    |--------------------------------------------------------------------------
    */

    const analytics =
        useSelector(
            selectAnalytics
        );

    const loading =
        useSelector(
            selectAnalyticsLoading
        );

    const error =
        useSelector(
            selectAnalyticsError
        );

    const storedDateRange =
        useSelector(
            selectAnalyticsDateRange
        );


    /*
    |--------------------------------------------------------------------------
    | Local Date State
    |--------------------------------------------------------------------------
    */

    const defaultRange =
        useMemo(
            () =>
                getDefaultRange(),
            []
        );


    const [
        from,
        setFrom,
    ] = useState(
        storedDateRange.from ||
        defaultRange.from
    );


    const [
        to,
        setTo,
    ] = useState(
        storedDateRange.to ||
        defaultRange.to
    );


    const [
        refreshing,
        setRefreshing,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Initial Fetch
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        dispatch(
            fetchAnalytics({
                from,
                to,
            })
        );

    }, [
        dispatch,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Apply Date Range
    |--------------------------------------------------------------------------
    */

    const handleApplyDateRange =
        () => {

            if (!from || !to) {
                return;
            }

            if (
                from > to
            ) {
                return;
            }

            dispatch(
                fetchAnalytics({
                    from,
                    to,
                })
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Refresh
    |--------------------------------------------------------------------------
    */

    const handleRefresh =
        async () => {

            setRefreshing(true);

            try {

                await dispatch(
                    fetchAnalytics({
                        from,
                        to,
                    })
                ).unwrap();

            } catch (refreshError) {

                console.error(
                    "Analytics refresh error:",
                    refreshError
                );

            } finally {

                setRefreshing(
                    false
                );

            }
        };


    /*
    |--------------------------------------------------------------------------
    | Analytics Data
    |--------------------------------------------------------------------------
    */

    const bookings =
        analytics?.bookings || {};

    const tables =
        analytics?.tables || {};

    const customers =
        analytics?.customers || {};

    const statuses =
        analytics?.statuses || [];

    const sources =
        analytics?.sources || [];

    const payments =
        analytics?.payments || [];

    const dailyTrend =
        analytics?.dailyTrend || [];


    /*
    |--------------------------------------------------------------------------
    | KPI Cards
    |--------------------------------------------------------------------------
    */

    const kpis = [
        {
            title: "Total Bookings",
            value:
                bookings.total || 0,
            description:
                "Reservations in selected period",
            icon:
                CalendarDays,
            className:
                "bg-blue-50 text-blue-600",
        },

        {
            title: "Confirmed",
            value:
                bookings.confirmed || 0,
            description:
                "Confirmed reservations",
            icon:
                CheckCircle2,
            className:
                "bg-emerald-50 text-emerald-600",
        },

        {
            title: "Guests",
            value:
                bookings.guests || 0,
            description:
                "Expected guests",
            icon:
                Users,
            className:
                "bg-violet-50 text-violet-600",
        },

        {
            title: "Completed",
            value:
                bookings.completed || 0,
            description:
                "Completed reservations",
            icon:
                TrendingUp,
            className:
                "bg-amber-50 text-amber-600",
        },
    ];


    /*
    |--------------------------------------------------------------------------
    | Booking Completion Rate
    |--------------------------------------------------------------------------
    */

    const completionRate =
        bookings.total > 0
            ? (
                (
                    bookings.completed /
                    bookings.total
                ) *
                100
            ).toFixed(1)
            : "0.0";


    /*
    |--------------------------------------------------------------------------
    | Cancellation Rate
    |--------------------------------------------------------------------------
    */

    const cancellationRate =
        bookings.total > 0
            ? (
                (
                    bookings.cancelled /
                    bookings.total
                ) *
                100
            ).toFixed(1)
            : "0.0";


    /*
    |--------------------------------------------------------------------------
    | Average Guests
    |--------------------------------------------------------------------------
    */

    const averageGuests =
        bookings.total > 0
            ? (
                bookings.guests /
                bookings.total
            ).toFixed(1)
            : "0.0";


    /*
    |--------------------------------------------------------------------------
    | Max Trend Value
    |--------------------------------------------------------------------------
    */

    const maxDailyBookings =
        Math.max(
            ...dailyTrend.map(
                (item) =>
                    Number(
                        item?.bookings || 0
                    )
            ),
            1
        );


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-6">

            {/* =========================================================
                Header
            ========================================================= */}

            <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

                <div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                        <BarChart3 className="h-4 w-4" />

                        <span>
                            Restaurant Analytics
                        </span>

                    </div>


                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        Analytics
                    </h1>


                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Monitor booking performance, guests,
                        booking sources, table operations,
                        and customer activity.
                    </p>

                </div>


                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">

                    {/* Date From */}

                    <div>

                        <label
                            htmlFor="analytics-from"
                            className="mb-1.5 block text-xs font-semibold text-slate-600"
                        >
                            From
                        </label>

                        <input
                            id="analytics-from"
                            type="date"
                            value={from}
                            onChange={(
                                event
                            ) =>
                                setFrom(
                                    event.target.value
                                )
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    {/* Date To */}

                    <div>

                        <label
                            htmlFor="analytics-to"
                            className="mb-1.5 block text-xs font-semibold text-slate-600"
                        >
                            To
                        </label>

                        <input
                            id="analytics-to"
                            type="date"
                            value={to}
                            onChange={(
                                event
                            ) =>
                                setTo(
                                    event.target.value
                                )
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    <button
                        type="button"
                        onClick={
                            handleApplyDateRange
                        }
                        disabled={
                            loading ||
                            !from ||
                            !to ||
                            from > to
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Apply
                    </button>


                    <button
                        type="button"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            loading ||
                            refreshing
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2.5
                            text-slate-600
                            shadow-sm
                            transition
                            hover:bg-slate-50
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                        aria-label="Refresh analytics"
                    >

                        <RefreshCw
                            className={`h-4 w-4 ${
                                refreshing ||
                                loading
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                    </button>

                </div>

            </section>


            {/* =========================================================
                Error
            ========================================================= */}

            {error && (

                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <div>

                        <p className="font-semibold">
                            Unable to load analytics
                        </p>

                        <p className="mt-1">
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* =========================================================
                KPI Cards
            ========================================================= */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {kpis.map(
                    (card) => {

                        const Icon =
                            card.icon;

                        return (
                            <article
                                key={
                                    card.title
                                }
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-5
                                    shadow-sm
                                "
                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-slate-500">
                                            {
                                                card.title
                                            }
                                        </p>

                                        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                                            {
                                                formatNumber(
                                                    card.value
                                                )
                                            }
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
                                            ${card.className}
                                        `}
                                    >

                                        <Icon className="h-5 w-5" />

                                    </div>

                                </div>


                                <p className="mt-4 text-xs text-slate-500">
                                    {
                                        card.description
                                    }
                                </p>

                            </article>
                        );

                    }
                )}

            </section>


            {/* =========================================================
                Operational Summary
            ========================================================= */}

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                <MetricCard
                    title="Completion Rate"
                    value={`${completionRate}%`}
                    description="Completed bookings / total bookings"
                    icon={CheckCircle2}
                />


                <MetricCard
                    title="Cancellation Rate"
                    value={`${cancellationRate}%`}
                    description="Cancelled bookings / total bookings"
                    icon={XCircle}
                />


                <MetricCard
                    title="Average Guests"
                    value={averageGuests}
                    description="Average guest count per booking"
                    icon={Users}
                />

            </section>


            {/* =========================================================
                Booking Trend
            ========================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <SectionHeader
                    title="Booking Trend"
                    description="Daily reservations during the selected period"
                />


                <div className="p-5 sm:p-6">

                    {loading &&
                    dailyTrend.length ===
                        0 ? (

                        <ChartLoading />

                    ) : dailyTrend.length ===
                      0 ? (

                        <EmptyChart
                            title="No booking data"
                            description="There are no bookings in the selected period."
                        />

                    ) : (

                        <div className="space-y-4">

                            {dailyTrend.map(
                                (
                                    item
                                ) => {

                                    const value =
                                        Number(
                                            item?.bookings ||
                                            0
                                        );

                                    const width =
                                        Math.max(
                                            (
                                                value /
                                                maxDailyBookings
                                            ) *
                                                100,
                                            value >
                                                0
                                                ? 4
                                                : 0
                                        );

                                    return (
                                        <div
                                            key={
                                                item._id
                                            }
                                            className="grid grid-cols-[76px_1fr_42px] items-center gap-3"
                                        >

                                            <span className="text-xs font-medium text-slate-500">
                                                {
                                                    formatTrendDate(
                                                        item._id
                                                    )
                                                }
                                            </span>


                                            <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                                                <div
                                                    className="h-full rounded-full bg-blue-600 transition-all"
                                                    style={{
                                                        width:
                                                            `${width}%`,
                                                    }}
                                                />

                                            </div>


                                            <span className="text-right text-xs font-semibold text-slate-700">
                                                {
                                                    value
                                                }
                                            </span>

                                        </div>
                                    );

                                }
                            )}

                        </div>

                    )}

                </div>

            </section>


            {/* =========================================================
                Status + Sources
            ========================================================= */}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                <AnalyticsCard
                    title="Booking Status"
                    description="Reservation status distribution"
                >

                    <div className="space-y-3">

                        {statuses.map(
                            (item) => (

                                <BreakdownRow
                                    key={
                                        item.status
                                    }
                                    label={
                                        formatSource(
                                            item.status
                                        )
                                    }
                                    value={
                                        item.count
                                    }
                                    secondary={
                                        `${formatNumber(item.guests)} guests`
                                    }
                                    icon={
                                        getStatusIcon(
                                            item.status
                                        )
                                    }
                                />

                            )
                        )}

                    </div>

                </AnalyticsCard>


                <AnalyticsCard
                    title="Booking Sources"
                    description="Where reservations are coming from"
                >

                    <div className="space-y-3">

                        {sources.map(
                            (item) => (

                                <BreakdownRow
                                    key={
                                        item.source
                                    }
                                    label={
                                        formatSource(
                                            item.source
                                        )
                                    }
                                    value={
                                        item.count
                                    }
                                    secondary={
                                        `${formatNumber(item.guests)} guests`
                                    }
                                    icon={
                                        Activity
                                    }
                                />

                            )
                        )}

                    </div>

                </AnalyticsCard>

            </section>


            {/* =========================================================
                Tables + Customers + Payments
            ========================================================= */}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                <AnalyticsCard
                    title="Table Operations"
                    description="Current table status"
                    icon={
                        Table2
                    }
                >

                    <div className="space-y-3">

                        <InfoRow
                            label="Total Tables"
                            value={
                                tables.total
                            }
                        />

                        <InfoRow
                            label="Available"
                            value={
                                tables.available
                            }
                        />

                        <InfoRow
                            label="Reserved"
                            value={
                                tables.reserved
                            }
                        />

                        <InfoRow
                            label="Occupied"
                            value={
                                tables.occupied
                            }
                        />

                        <InfoRow
                            label="Maintenance"
                            value={
                                tables.maintenance
                            }
                        />

                    </div>

                </AnalyticsCard>


                <AnalyticsCard
                    title="Customer Overview"
                    description="Restaurant customer activity"
                    icon={
                        Users
                    }
                >

                    <div className="space-y-3">

                        <InfoRow
                            label="Customers"
                            value={
                                customers.total
                            }
                        />

                        <InfoRow
                            label="Visits"
                            value={
                                customers.visits
                            }
                        />

                        <InfoRow
                            label="Bookings"
                            value={
                                customers.bookings
                            }
                        />

                        <InfoRow
                            label="Blocked"
                            value={
                                customers.blocked
                            }
                        />

                    </div>

                </AnalyticsCard>


                <AnalyticsCard
                    title="Payment Status"
                    description="Payment status of bookings"
                >

                    <div className="space-y-3">

                        {payments.map(
                            (item) => (

                                <InfoRow
                                    key={
                                        item.status
                                    }
                                    label={
                                        formatSource(
                                            item.status
                                        )
                                    }
                                    value={
                                        item.count
                                    }
                                />

                            )
                        )}

                    </div>

                </AnalyticsCard>

            </section>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Section Header
|--------------------------------------------------------------------------
*/

const SectionHeader = ({
    title,
    description,
}) => {

    return (
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">

            <h2 className="font-semibold text-slate-950">
                {title}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
                {description}
            </p>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Analytics Card
|--------------------------------------------------------------------------
*/

const AnalyticsCard = ({
    title,
    description,
    icon: Icon,
    children,
}) => {

    return (
        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">

                {Icon && (

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

                        <Icon className="h-4 w-4" />

                    </div>

                )}

                <div>

                    <h2 className="font-semibold text-slate-950">
                        {title}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        {description}
                    </p>

                </div>

            </div>


            <div className="p-5">
                {children}
            </div>

        </article>
    );
};


/*
|--------------------------------------------------------------------------
| Metric Card
|--------------------------------------------------------------------------
*/

const MetricCard = ({
    title,
    value,
    description,
    icon: Icon,
}) => {

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-950">
                        {value}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                        {description}
                    </p>

                </div>


                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                    <Icon className="h-5 w-5" />

                </div>

            </div>

        </article>
    );
};


/*
|--------------------------------------------------------------------------
| Breakdown Row
|--------------------------------------------------------------------------
*/

const BreakdownRow = ({
    label,
    value,
    secondary,
    icon: Icon,
}) => {

    return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

                <Icon className="h-4 w-4" />

            </div>


            <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-slate-800">
                    {label}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                    {secondary}
                </p>

            </div>


            <span className="text-sm font-bold text-slate-900">
                {formatNumber(value)}
            </span>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Info Row
|--------------------------------------------------------------------------
*/

const InfoRow = ({
    label,
    value,
}) => {

    return (
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">

            <span className="text-sm text-slate-600">
                {label}
            </span>

            <span className="text-sm font-semibold text-slate-900">
                {formatNumber(value)}
            </span>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Chart Loading
|--------------------------------------------------------------------------
*/

const ChartLoading = () => {

    return (
        <div className="flex h-64 items-center justify-center">

            <div className="text-center">

                <RefreshCw className="mx-auto h-7 w-7 animate-spin text-blue-600" />

                <p className="mt-3 text-sm font-medium text-slate-700">
                    Loading analytics...
                </p>

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Empty Chart
|--------------------------------------------------------------------------
*/

const EmptyChart = ({
    title,
    description,
}) => {

    return (
        <div className="flex h-64 flex-col items-center justify-center text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">

                <BarChart3 className="h-5 w-5" />

            </div>

            <p className="mt-3 text-sm font-semibold text-slate-800">
                {title}
            </p>

            <p className="mt-1 text-xs text-slate-500">
                {description}
            </p>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatTrendDate = (
    value
) => {

    if (!value) {
        return "—";
    }

    const date =
        new Date(
            `${value}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
        }
    ).format(date);
};


const getStatusIcon = (
    status
) => {

    switch (
        status
    ) {

        case "confirmed":
            return CheckCircle2;

        case "completed":
            return TrendingUp;

        case "cancelled":
            return XCircle;

        case "pending":
            return Clock3;

        case "seated":
            return Users;

        case "no_show":
            return XCircle;

        default:
            return Activity;
    }
};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default Analytics;