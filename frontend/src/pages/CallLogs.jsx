import {
    Activity,
    ArrowLeft,
    ChevronDown,
    Clock3,
    Eye,
    Filter,
    Phone,
    PhoneIncoming,
    PhoneOutgoing,
    RefreshCw,
    Search,
    UserRound,
    X,
    XCircle,
    CheckCircle2
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    fetchCallLogs,
    fetchCallLog,

    selectCallLogs,
    selectSelectedCall,
    selectCallPagination,
    selectCallFilters,
    selectCallLoading,
    selectCallError,

    setCallFilters,
    setCallPage,
    setSelectedCall,
    clearSelectedCall,
} from "../features/callSlice.js";


/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const CALL_STATUSES = [
    "Ringing",
    "Answered",
    "Completed",
    "Missed",
    "Busy",
    "Failed",
    "Cancelled",
];

const CALL_DIRECTIONS = [
    "Incoming",
    "Outgoing",
];

const AI_OUTCOMES = [
    "Booking Created",
    "Booking Updated",
    "Booking Cancelled",
    "Availability Checked",
    "Information Requested",
    "Transferred to Human",
    "No Action",
];

const SENTIMENTS = [
    "Positive",
    "Neutral",
    "Negative",
];


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatStatus = (
    value
) => {

    if (!value) {
        return "Unknown";
    }

    return String(value);
};


const formatDuration = (
    seconds
) => {

    const totalSeconds =
        Number(seconds || 0);

    if (
        !Number.isFinite(
            totalSeconds
        ) ||
        totalSeconds < 0
    ) {
        return "0s";
    }

    const hours =
        Math.floor(
            totalSeconds / 3600
        );

    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) / 60
        );

    const remainingSeconds =
        Math.floor(
            totalSeconds % 60
        );


    if (hours > 0) {

        return `${hours}h ${minutes}m`;

    }


    if (minutes > 0) {

        return `${minutes}m ${remainingSeconds}s`;

    }


    return `${remainingSeconds}s`;
};


const formatDateTime = (
    value
) => {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

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
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    ).format(date);
};


const getCustomerName = (
    call
) => {

    return (
        call?.customer?.fullName ||
        call?.customerName ||
        "Unknown customer"
    );
};


const getCustomerPhone = (
    call
) => {

    return (
        call?.phoneNumber ||
        call?.customer?.phone ||
        "—"
    );
};


const getCallId = (
    call
) => {

    return (
        call?._id ||
        call?.id ||
        ""
    );
};


/*
|--------------------------------------------------------------------------
| Call Logs Page
|--------------------------------------------------------------------------
*/

const CallLogs = () => {

    const dispatch =
        useDispatch();


    /*
    |--------------------------------------------------------------------------
    | Redux State
    |--------------------------------------------------------------------------
    */

    const calls =
        useSelector(
            selectCallLogs
        );

    const selectedCall =
        useSelector(
            selectSelectedCall
        );

    const pagination =
        useSelector(
            selectCallPagination
        );

    const filters =
        useSelector(
            selectCallFilters
        );

    const loading =
        useSelector(
            selectCallLoading
        );

    const error =
        useSelector(
            selectCallError
        );


    /*
    |--------------------------------------------------------------------------
    | Local State
    |--------------------------------------------------------------------------
    */

    const [
        search,
        setSearch,
    ] = useState(
        filters?.phoneNumber ||
        ""
    );


    const [
        showFilters,
        setShowFilters,
    ] = useState(false);


    const [
        detailsOpen,
        setDetailsOpen,
    ] = useState(false);


    const [
        detailsLoading,
        setDetailsLoading,
    ] = useState(false);


    const [
        refreshing,
        setRefreshing,
    ] = useState(false);


    const [
        actionCallId,
        setActionCallId,
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Load Call Logs
    |--------------------------------------------------------------------------
    */

    const loadCalls =
        useCallback(
            async () => {

                try {

                    await dispatch(
                        fetchCallLogs({
                            ...filters,

                            page:
                                pagination?.page ||
                                1,

                            limit:
                                pagination?.limit ||
                                20,
                        })
                    ).unwrap();

                } catch (loadError) {

                    console.error(
                        "Load call logs error:",
                        loadError
                    );
                }

            },
            [
                dispatch,
                filters,
                pagination?.page,
                pagination?.limit,
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | Initial Fetch / Filter Fetch
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadCalls();

    }, [
        loadCalls,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    |
    | Backend filtering is preferred for large datasets.
    | This page commits search to phoneNumber.
    |
    */

    useEffect(() => {

        const timeout =
            window.setTimeout(
                () => {

                    dispatch(
                        setCallFilters({
                            phoneNumber:
                                search.trim(),
                        })
                    );

                    dispatch(
                        setCallPage(
                            1
                        )
                    );

                },
                400
            );


        return () => {

            window.clearTimeout(
                timeout
            );

        };

    }, [
        dispatch,
        search,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Refresh
    |--------------------------------------------------------------------------
    */

    const handleRefresh =
        async () => {

            setRefreshing(
                true
            );

            try {

                await dispatch(
                    fetchCallLogs({
                        ...filters,

                        phoneNumber:
                            search.trim(),

                        page:
                            pagination?.page ||
                            1,

                        limit:
                            pagination?.limit ||
                            20,
                    })
                ).unwrap();

            } catch (
                refreshError
            ) {

                console.error(
                    "Refresh call logs error:",
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
    | Open Details
    |--------------------------------------------------------------------------
    */

    const openDetails =
        async (
            call
        ) => {

            const callId =
                getCallId(
                    call
                );


            if (!callId) {

                return;
            }


            setActionCallId(
                callId
            );

            setDetailsLoading(
                true
            );


            try {

                const result =
                    await dispatch(
                        fetchCallLog(
                            callId
                        )
                    ).unwrap();


                /*
                |----------------------------------------------------------
                | The thunk normally stores selectedCall itself.
                | This fallback keeps the page resilient to different
                | thunk implementations.
                |----------------------------------------------------------
                */

                if (
                    result?.data?.call
                ) {

                    dispatch(
                        setSelectedCall(
                            result.data.call
                        )
                    );

                } else if (
                    result?.call
                ) {

                    dispatch(
                        setSelectedCall(
                            result.call
                        )
                    );
                }


                setDetailsOpen(
                    true
                );

            } catch (
                detailError
            ) {

                console.error(
                    "Load call details error:",
                    detailError
                );

            } finally {

                setActionCallId(
                    null
                );

                setDetailsLoading(
                    false
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Close Details
    |--------------------------------------------------------------------------
    */

    const closeDetails =
        () => {

            setDetailsOpen(
                false
            );

            dispatch(
                clearSelectedCall()
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Filter Changes
    |--------------------------------------------------------------------------
    */

    const handleFilterChange =
        (
            name,
            value
        ) => {

            dispatch(
                setCallFilters({
                    [name]:
                        value ||
                        "",
                })
            );

            dispatch(
                setCallPage(
                    1
                )
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */

    const clearFilters =
        () => {

            setSearch(
                ""
            );

            dispatch(
                setCallFilters({
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
                })
            );

            dispatch(
                setCallPage(
                    1
                )
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Has Active Filters
    |--------------------------------------------------------------------------
    */

    const hasFilters =
        Boolean(
            search.trim()
        ) ||
        Boolean(
            filters?.callStatus
        ) ||
        Boolean(
            filters?.direction
        ) ||
        Boolean(
            filters?.aiOutcome
        ) ||
        Boolean(
            filters?.sentiment
        ) ||
        Boolean(
            filters?.from
        ) ||
        Boolean(
            filters?.to
        );


    /*
    |--------------------------------------------------------------------------
    | Page Statistics
    |--------------------------------------------------------------------------
    |
    | These are derived from the currently loaded records.
    |
    | For large datasets, production KPI cards should eventually come
    | from a dedicated backend statistics endpoint.
    |
    */

    const statistics =
        useMemo(
            () => {

                const result = {
                    total:
                        pagination?.total ||
                        calls.length,

                    completed: 0,

                    missed: 0,

                    failed: 0,

                    incoming: 0,

                    outgoing: 0,

                    bookings: 0,

                };


                calls.forEach(
                    (
                        call
                    ) => {

                        if (
                            call?.callStatus ===
                            "Completed"
                        ) {
                            result.completed +=
                                1;
                        }


                        if (
                            call?.callStatus ===
                            "Missed"
                        ) {
                            result.missed +=
                                1;
                        }


                        if (
                            call?.callStatus ===
                            "Failed"
                        ) {
                            result.failed +=
                                1;
                        }


                        if (
                            call?.direction ===
                            "Incoming"
                        ) {
                            result.incoming +=
                                1;
                        }


                        if (
                            call?.direction ===
                            "Outgoing"
                        ) {
                            result.outgoing +=
                                1;
                        }


                        if (
                            call?.aiOutcome ===
                            "Booking Created"
                        ) {
                            result.bookings +=
                                1;
                        }

                    }
                );


                return result;

            },
            [
                calls,
                pagination?.total,
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-6">

            {/* =========================================================
                Page Header
            ========================================================= */}

            <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                <div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                        <Phone className="h-4 w-4" />

                        <span>
                            Voice Operations
                        </span>

                    </div>


                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        Call Logs
                    </h1>


                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Review incoming and outgoing calls handled by your restaurant voice system.
                    </p>

                </div>


                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            refreshing ||
                            loading
                        }
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
                            hover:bg-slate-50
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        <RefreshCw
                            className={`h-4 w-4 ${
                                refreshing ||
                                loading
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Refresh

                    </button>

                </div>

            </section>


            {/* =========================================================
                Statistics
            ========================================================= */}

            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-7">

                <StatCard
                    label="Total Calls"
                    value={
                        statistics.total
                    }
                    icon={
                        Phone
                    }
                />

                <StatCard
                    label="Completed"
                    value={
                        statistics.completed
                    }
                    icon={
                        CheckIcon
                    }
                />

                <StatCard
                    label="Missed"
                    value={
                        statistics.missed
                    }
                    icon={
                        PhoneIncoming
                    }
                />

                <StatCard
                    label="Failed"
                    value={
                        statistics.failed
                    }
                    icon={
                        XCircle
                    }
                />

                <StatCard
                    label="Incoming"
                    value={
                        statistics.incoming
                    }
                    icon={
                        PhoneIncoming
                    }
                />

                <StatCard
                    label="Outgoing"
                    value={
                        statistics.outgoing
                    }
                    icon={
                        PhoneOutgoing
                    }
                />

                <StatCard
                    label="Bookings"
                    value={
                        statistics.bookings
                    }
                    icon={
                        Activity
                    }
                />

            </section>


            {/* =========================================================
                Search / Filters
            ========================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

                    <div className="relative flex-1">

                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="search"
                            value={
                                search
                            }
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search by customer phone number..."
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                pl-10
                                pr-4
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:bg-white
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            setShowFilters(
                                (
                                    value
                                ) =>
                                    !value
                            )
                        }
                        className="
                            inline-flex
                            h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            font-semibold
                            text-slate-700
                            transition
                            hover:bg-slate-50
                        "
                    >

                        <Filter className="h-4 w-4" />

                        Filters

                        {hasFilters && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                                !
                            </span>
                        )}

                    </button>

                </div>


                {showFilters && (

                    <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2 xl:grid-cols-4">

                        <FilterSelect
                            label="Call Status"
                            value={
                                filters?.callStatus ||
                                ""
                            }
                            onChange={(
                                value
                            ) =>
                                handleFilterChange(
                                    "callStatus",
                                    value
                                )
                            }
                            options={[
                                {
                                    value: "",
                                    label:
                                        "All statuses",
                                },

                                ...CALL_STATUSES.map(
                                    (
                                        status
                                    ) => ({
                                        value:
                                            status,
                                        label:
                                            status,
                                    })
                                ),
                            ]}
                        />


                        <FilterSelect
                            label="Direction"
                            value={
                                filters?.direction ||
                                ""
                            }
                            onChange={(
                                value
                            ) =>
                                handleFilterChange(
                                    "direction",
                                    value
                                )
                            }
                            options={[
                                {
                                    value: "",
                                    label:
                                        "All directions",
                                },

                                ...CALL_DIRECTIONS.map(
                                    (
                                        direction
                                    ) => ({
                                        value:
                                            direction,
                                        label:
                                            direction,
                                    })
                                ),
                            ]}
                        />


                        <FilterSelect
                            label="AI Outcome"
                            value={
                                filters?.aiOutcome ||
                                ""
                            }
                            onChange={(
                                value
                            ) =>
                                handleFilterChange(
                                    "aiOutcome",
                                    value
                                )
                            }
                            options={[
                                {
                                    value: "",
                                    label:
                                        "All outcomes",
                                },

                                ...AI_OUTCOMES.map(
                                    (
                                        outcome
                                    ) => ({
                                        value:
                                            outcome,
                                        label:
                                            outcome,
                                    })
                                ),
                            ]}
                        />


                        <FilterSelect
                            label="Sentiment"
                            value={
                                filters?.sentiment ||
                                ""
                            }
                            onChange={(
                                value
                            ) =>
                                handleFilterChange(
                                    "sentiment",
                                    value
                                )
                            }
                            options={[
                                {
                                    value: "",
                                    label:
                                        "All sentiments",
                                },

                                ...SENTIMENTS.map(
                                    (
                                        sentiment
                                    ) => ({
                                        value:
                                            sentiment,
                                        label:
                                            sentiment,
                                    })
                                ),
                            ]}
                        />


                        <DateFilter
                            label="From"
                            value={
                                filters?.from ||
                                ""
                            }
                            onChange={(
                                value
                            ) =>
                                handleFilterChange(
                                    "from",
                                    value
                                )
                            }
                        />


                        <DateFilter
                            label="To"
                            value={
                                filters?.to ||
                                ""
                            }
                            onChange={(
                                value
                            ) =>
                                handleFilterChange(
                                    "to",
                                    value
                                )
                            }
                        />


                        <div className="flex items-end">

                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                disabled={
                                    !hasFilters
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-slate-600
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                Clear filters
                            </button>

                        </div>

                    </div>
                )}

            </section>


            {/* =========================================================
                Error
            ========================================================= */}

            {error && (

                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <div>

                        <p className="font-semibold">
                            Unable to load call logs
                        </p>

                        <p className="mt-1">
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* =========================================================
                Table
            ========================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Desktop Heading */}

                <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 lg:grid lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr_100px] lg:items-center lg:gap-4">

                    <HeaderCell>
                        Customer
                    </HeaderCell>

                    <HeaderCell>
                        Direction
                    </HeaderCell>

                    <HeaderCell>
                        Status
                    </HeaderCell>

                    <HeaderCell>
                        Duration
                    </HeaderCell>

                    <HeaderCell>
                        AI Outcome
                    </HeaderCell>

                    <HeaderCell>
                        Action
                    </HeaderCell>

                </div>


                {loading &&
                calls.length === 0 ? (

                    <LoadingState />

                ) : calls.length ===
                  0 ? (

                    <EmptyState
                        hasFilters={
                            hasFilters
                        }
                        onClear={
                            clearFilters
                        }
                    />

                ) : (

                    <div className="divide-y divide-slate-100">

                        {calls.map(
                            (
                                call
                            ) => {

                                const callId =
                                    getCallId(
                                        call
                                    );


                                return (
                                    <CallRow
                                        key={
                                            callId
                                        }
                                        call={
                                            call
                                        }
                                        onView={
                                            openDetails
                                        }
                                        actionCallId={
                                            actionCallId
                                        }
                                    />
                                );
                            }
                        )}

                    </div>

                )}

            </section>


            {/* =========================================================
                Pagination
            ========================================================= */}

            <Pagination
                pagination={
                    pagination
                }
                onPageChange={(
                    page
                ) => {

                    dispatch(
                        setCallPage(
                            page
                        )
                    );

                }}
            />


            {/* =========================================================
                Details Drawer
            ========================================================= */}

            {detailsOpen && (

                <CallDetailsDrawer
                    call={
                        selectedCall
                    }
                    loading={
                        detailsLoading
                    }
                    onClose={
                        closeDetails
                    }
                />

            )}

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

const StatCard = ({
    label,
    value,
    icon: Icon,
}) => {

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">

                    <p className="truncate text-xs font-medium text-slate-500">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-950">
                        {Number(
                            value || 0
                        ).toLocaleString(
                            "en-IN"
                        )}
                    </p>

                </div>


                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                    <Icon className="h-5 w-5" />

                </div>

            </div>

        </article>
    );
};


/*
|--------------------------------------------------------------------------
| Check Icon
|--------------------------------------------------------------------------
*/

const CheckIcon = CheckCircle2;


/*
|--------------------------------------------------------------------------
| Header Cell
|--------------------------------------------------------------------------
*/

const HeaderCell = ({
    children,
}) => {

    return (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {children}
        </span>
    );
};


/*
|--------------------------------------------------------------------------
| Call Row
|--------------------------------------------------------------------------
*/

const CallRow = ({
    call,
    onView,
    actionCallId,
}) => {

    const callId =
        getCallId(
            call
        );


    const isLoading =
        actionCallId ===
        callId;


    return (
        <div className="px-5 py-4">

            {/* Desktop */}

            <div className="hidden lg:grid lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr_100px] lg:items-center lg:gap-4">

                <CustomerCell
                    call={
                        call
                    }
                />


                <DirectionCell
                    direction={
                        call?.direction
                    }
                />


                <StatusBadge
                    status={
                        call?.callStatus
                    }
                />


                <div className="text-sm text-slate-600">

                    <div className="flex items-center gap-2">

                        <Clock3 className="h-4 w-4 text-slate-400" />

                        {
                            formatDuration(
                                call?.duration
                            )
                        }

                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                        {
                            formatDateTime(
                                call?.startedAt
                            )
                        }
                    </p>

                </div>


                <div>

                    <p className="text-sm font-medium text-slate-700">
                        {
                            call?.aiOutcome ||
                            "No Action"
                        }
                    </p>

                    {call?.booking && (
                        <p className="mt-1 text-xs text-blue-600">
                            Booking linked
                        </p>
                    )}

                </div>


                <button
                    type="button"
                    onClick={() =>
                        onView(
                            call
                        )
                    }
                    disabled={
                        isLoading
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-slate-700
                        transition
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {isLoading ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Eye className="h-3.5 w-3.5" />
                    )}

                    View

                </button>

            </div>


            {/* Mobile */}

            <div className="lg:hidden">

                <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                        {call?.direction ===
                        "Outgoing" ? (
                            <PhoneOutgoing className="h-5 w-5" />
                        ) : (
                            <PhoneIncoming className="h-5 w-5" />
                        )}

                    </div>


                    <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-slate-900">
                            {
                                getCustomerName(
                                    call
                                )
                            }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            {
                                getCustomerPhone(
                                    call
                                )
                            }
                        </p>


                        <div className="mt-3 flex flex-wrap items-center gap-2">

                            <DirectionCell
                                direction={
                                    call?.direction
                                }
                            />

                            <StatusBadge
                                status={
                                    call?.callStatus
                                }
                            />

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            onView(
                                call
                            )
                        }
                        disabled={
                            isLoading
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="View call details"
                    >

                        {isLoading ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}

                    </button>

                </div>


                <div className="mt-4 grid grid-cols-2 gap-3">

                    <InfoBox
                        label="Duration"
                        value={
                            formatDuration(
                                call?.duration
                            )
                        }
                    />


                    <InfoBox
                        label="Started"
                        value={
                            formatDateTime(
                                call?.startedAt
                            )
                        }
                    />


                    <InfoBox
                        label="AI Outcome"
                        value={
                            call?.aiOutcome ||
                            "No Action"
                        }
                    />


                    <InfoBox
                        label="Sentiment"
                        value={
                            call?.sentiment ||
                            "Neutral"
                        }
                    />

                </div>

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Customer Cell
|--------------------------------------------------------------------------
*/

const CustomerCell = ({
    call,
}) => {

    return (
        <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                <UserRound className="h-5 w-5" />

            </div>


            <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-slate-900">
                    {
                        getCustomerName(
                            call
                        )
                    }
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                    {
                        getCustomerPhone(
                            call
                        )
                    }
                </p>

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Direction
|--------------------------------------------------------------------------
*/

const DirectionCell = ({
    direction,
}) => {

    const outgoing =
        direction ===
        "Outgoing";


    return (
        <div className="flex items-center gap-2 text-sm">

            {outgoing ? (
                <PhoneOutgoing className="h-4 w-4 text-violet-500" />
            ) : (
                <PhoneIncoming className="h-4 w-4 text-blue-500" />
            )}

            <span className="text-slate-600">
                {direction ||
                    "Unknown"}
            </span>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

const StatusBadge = ({
    status,
}) => {

    const styles = {

        Ringing:
            "bg-amber-50 text-amber-700",

        Answered:
            "bg-blue-50 text-blue-700",

        Completed:
            "bg-emerald-50 text-emerald-700",

        Missed:
            "bg-orange-50 text-orange-700",

        Busy:
            "bg-slate-100 text-slate-700",

        Failed:
            "bg-red-50 text-red-700",

        Cancelled:
            "bg-slate-100 text-slate-600",

    };


    return (
        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-[11px]
                font-semibold
                ${
                    styles[
                        status
                    ] ||
                    "bg-slate-100 text-slate-600"
                }
            `}
        >
            {
                formatStatus(
                    status
                )
            }
        </span>
    );
};


/*
|--------------------------------------------------------------------------
| Info Box
|--------------------------------------------------------------------------
*/

const InfoBox = ({
    label,
    value,
}) => {

    return (
        <div className="rounded-xl bg-slate-50 p-3">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
                {value}
            </p>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Filter Select
|--------------------------------------------------------------------------
*/

const FilterSelect = ({
    label,
    value,
    onChange,
    options,
}) => {

    return (
        <label className="block">

            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                {label}
            </span>


            <div className="relative">

                <select
                    value={
                        value
                    }
                    onChange={(
                        event
                    ) =>
                        onChange(
                            event.target.value
                        )
                    }
                    className="
                        w-full
                        appearance-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2.5
                        pr-9
                        text-sm
                        text-slate-700
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                    "
                >

                    {options.map(
                        (
                            option
                        ) => (

                            <option
                                key={
                                    option.value
                                }
                                value={
                                    option.value
                                }
                            >
                                {
                                    option.label
                                }
                            </option>

                        )
                    )}

                </select>


                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            </div>

        </label>
    );
};


/*
|--------------------------------------------------------------------------
| Date Filter
|--------------------------------------------------------------------------
*/

const DateFilter = ({
    label,
    value,
    onChange,
}) => {

    return (
        <label className="block">

            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                {label}
            </span>

            <input
                type="date"
                value={
                    value
                }
                onChange={(
                    event
                ) =>
                    onChange(
                        event.target.value
                    )
                }
                className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            />

        </label>
    );
};


/*
|--------------------------------------------------------------------------
| Loading State
|--------------------------------------------------------------------------
*/

const LoadingState = () => {

    return (
        <div className="flex min-h-72 flex-col items-center justify-center">

            <RefreshCw className="h-7 w-7 animate-spin text-blue-600" />

            <p className="mt-3 text-sm font-medium text-slate-700">
                Loading call logs...
            </p>

            <p className="mt-1 text-xs text-slate-400">
                Retrieving recent voice activity.
            </p>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

const EmptyState = ({
    hasFilters,
    onClear,
}) => {

    return (
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                <Phone className="h-6 w-6" />

            </div>


            <h3 className="mt-4 text-sm font-semibold text-slate-900">

                {hasFilters
                    ? "No matching calls"
                    : "No call logs yet"}

            </h3>


            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">

                {hasFilters
                    ? "Try changing your filters or search."
                    : "Voice call activity will appear here when calls are received or placed."}

            </p>


            {hasFilters && (

                <button
                    type="button"
                    onClick={
                        onClear
                    }
                    className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    Clear filters
                </button>

            )}

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

const Pagination = ({
    pagination,
    onPageChange,
}) => {

    const currentPage =
        pagination?.page ||
        1;

    const totalPages =
        pagination?.totalPages ||
        0;


    if (
        totalPages <= 1
    ) {
        return null;
    }


    const canPrevious =
        currentPage >
        1;


    const canNext =
        currentPage <
        totalPages;


    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-slate-500">

                Page{" "}

                <span className="font-semibold text-slate-700">
                    {
                        currentPage
                    }
                </span>

                {" "}of{" "}

                <span className="font-semibold text-slate-700">
                    {
                        totalPages
                    }
                </span>

                {" · "}

                <span>
                    {
                        Number(
                            pagination?.total ||
                            0
                        ).toLocaleString(
                            "en-IN"
                        )
                    }{" "}
                    calls
                </span>

            </p>


            <div className="flex items-center gap-2">

                <button
                    type="button"
                    disabled={
                        !canPrevious
                    }
                    onClick={() =>
                        onPageChange(
                            currentPage -
                                1
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-slate-600
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Previous
                </button>


                <button
                    type="button"
                    disabled={
                        !canNext
                    }
                    onClick={() =>
                        onPageChange(
                            currentPage +
                                1
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-slate-600
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    Next
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                </button>

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Call Details Drawer
|--------------------------------------------------------------------------
*/

const CallDetailsDrawer = ({
    call,
    loading,
    onClose,
}) => {

    return (
        <div className="fixed inset-0 z-50">

            {/* Backdrop */}

            <button
                type="button"
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                onClick={
                    onClose
                }
                aria-label="Close call details"
            />


            {/* Drawer */}

            <aside className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Call Details
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-slate-950">
                            {
                                getCustomerName(
                                    call
                                )
                            }
                        </h2>

                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close"
                    >

                        <X className="h-5 w-5" />

                    </button>

                </div>


                {/* Body */}

                <div className="flex-1 overflow-y-auto">

                    {loading ? (

                        <div className="flex min-h-64 items-center justify-center">

                            <RefreshCw className="h-7 w-7 animate-spin text-blue-600" />

                        </div>

                    ) : !call ? (

                        <div className="flex min-h-64 items-center justify-center px-6 text-center">

                            <p className="text-sm text-slate-500">
                                Call details could not be loaded.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-6 p-5 sm:p-6">

                            {/* Summary */}

                            <section>

                                <div className="grid grid-cols-2 gap-3">

                                    <InfoBox
                                        label="Phone"
                                        value={
                                            call?.phoneNumber ||
                                            "—"
                                        }
                                    />

                                    <InfoBox
                                        label="Direction"
                                        value={
                                            call?.direction ||
                                            "—"
                                        }
                                    />

                                    <InfoBox
                                        label="Status"
                                        value={
                                            call?.callStatus ||
                                            "—"
                                        }
                                    />

                                    <InfoBox
                                        label="Duration"
                                        value={
                                            formatDuration(
                                                call?.duration
                                            )
                                        }
                                    />

                                    <InfoBox
                                        label="Started"
                                        value={
                                            formatDateTime(
                                                call?.startedAt
                                            )
                                        }
                                    />

                                    <InfoBox
                                        label="Ended"
                                        value={
                                            formatDateTime(
                                                call?.endedAt
                                            )
                                        }
                                    />

                                </div>

                            </section>


                            {/* AI Outcome */}

                            <section className="rounded-2xl border border-slate-200 p-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">

                                        <Activity className="h-4 w-4" />

                                    </div>


                                    <div>

                                        <p className="text-xs text-slate-500">
                                            AI Outcome
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {
                                                call?.aiOutcome ||
                                                "No Action"
                                            }
                                        </p>

                                    </div>

                                </div>

                            </section>


                            {/* Sentiment */}

                            <section className="rounded-2xl border border-slate-200 p-4">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-xs text-slate-500">
                                            Sentiment
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {
                                                call?.sentiment ||
                                                "Neutral"
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-slate-500">
                                            AI Handled
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">

                                            {call?.aiHandled
                                                ? "Yes"
                                                : "No"}

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-slate-500">
                                            Human Transfer
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">

                                            {call?.transferredToHuman
                                                ? "Yes"
                                                : "No"}

                                        </p>

                                    </div>

                                </div>

                            </section>


                            {/* Customer */}

                            <section>

                                <SectionTitle>
                                    Customer
                                </SectionTitle>


                                <div className="rounded-2xl border border-slate-200 p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                                            <UserRound className="h-5 w-5" />

                                        </div>


                                        <div>

                                            <p className="text-sm font-semibold text-slate-900">
                                                {
                                                    getCustomerName(
                                                        call
                                                    )
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {
                                                    getCustomerPhone(
                                                        call
                                                    )
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* Booking */}

                            {call?.booking && (

                                <section>

                                    <SectionTitle>
                                        Related Booking
                                    </SectionTitle>


                                    <div className="rounded-2xl border border-slate-200 p-4">

                                        <div className="grid grid-cols-2 gap-3">

                                            <InfoBox
                                                label="Booking ID"
                                                value={
                                                    call.booking?._id ||
                                                    call.booking?.id ||
                                                    "—"
                                                }
                                            />

                                            <InfoBox
                                                label="Status"
                                                value={
                                                    call.booking?.status ||
                                                    "—"
                                                }
                                            />

                                            <InfoBox
                                                label="Date"
                                                value={
                                                    formatDateTime(
                                                        call.booking?.bookingDate
                                                    )
                                                }
                                            />

                                            <InfoBox
                                                label="Time"
                                                value={
                                                    call.booking?.startTime ||
                                                    "—"
                                                }
                                            />

                                        </div>

                                    </div>

                                </section>

                            )}


                            {/* Summary */}

                            {call?.summary && (

                                <section>

                                    <SectionTitle>
                                        AI Summary
                                    </SectionTitle>


                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                            {
                                                call.summary
                                            }
                                        </p>

                                    </div>

                                </section>

                            )}


                            {/* Transcript */}

                            {call?.transcript && (

                                <section>

                                    <SectionTitle>
                                        Transcript
                                    </SectionTitle>


                                    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4">

                                        <pre className="whitespace-pre-wrap break-words font-sans text-xs leading-6 text-slate-200">
                                            {
                                                call.transcript
                                            }
                                        </pre>

                                    </div>

                                </section>

                            )}


                            {/* Notes */}

                            {call?.notes && (

                                <section>

                                    <SectionTitle>
                                        Notes
                                    </SectionTitle>


                                    <div className="rounded-2xl border border-slate-200 p-4">

                                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                            {
                                                call.notes
                                            }
                                        </p>

                                    </div>

                                </section>

                            )}


                            {/* Recording */}

                            {call?.recordingUrl && (

                                <section>

                                    <SectionTitle>
                                        Recording
                                    </SectionTitle>


                                    <a
                                        href={
                                            call.recordingUrl
                                        }
                                        target="_blank"
                                        rel="noreferrer"
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
                                            hover:bg-blue-700
                                        "
                                    >
                                        Open recording
                                    </a>

                                </section>

                            )}

                        </div>

                    )}

                </div>

            </aside>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Section Title
|--------------------------------------------------------------------------
*/

const SectionTitle = ({
    children,
}) => {

    return (
        <h3 className="mb-2 text-sm font-semibold text-slate-900">
            {children}
        </h3>
    );
};


/*
|--------------------------------------------------------------------------
| Lucide Alias
|--------------------------------------------------------------------------
|
| Keeps the stat configuration readable.
|
|--------------------------------------------------------------------------
*/

const CheckCircleIcon =
    ({
        className,
    }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={
                className
            }
        >
            <path
                d="M9 12l2 2 4-4"
            />

            <circle
                cx="12"
                cy="12"
                r="10"
            />
        </svg>
    );


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default CallLogs;