
import {
    CalendarCheck,
    CheckCircle2,
    ChevronDown,
    Edit3,
    Filter,
    Loader2,
    MoreHorizontal,
    Plus,
    RefreshCw,
    Search,
    Table2,
    Trash2,
    Users,
    X,
    AlertCircle,
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
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
    updateTableStatus,

    selectTables,
    selectTableLoading,
    selectTableError,

    selectCreating,
    selectCreateError,

    selectUpdating,
    selectUpdateError,

    selectDeleting,
    selectDeleteError,

    selectStatusUpdating,
    selectStatusUpdateError,
} from "../features/tableSlice.js";


/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

/*
 * These values MUST match the backend Table schema exactly.
 */

const TABLE_STATUSES = [
    "Available",
    "Reserved",
    "Occupied",
    "Maintenance",
];

const TABLE_LOCATIONS = [
    "Indoor",
    "Outdoor",
    "Window",
    "Private",
];


const EMPTY_FORM = {
    tableNumber: "",
    tableName: "",
    capacity: "",
    location: "Indoor",
    floor: 1,
    status: "Available",
    isActive: true,
    isMergeable: false,
    notes: "",
};


/*
|--------------------------------------------------------------------------
| Tables Page
|--------------------------------------------------------------------------
*/

const Tables = () => {

    const dispatch = useDispatch();


    /*
    |--------------------------------------------------------------------------
    | Redux State
    |--------------------------------------------------------------------------
    */

    const tables = useSelector(
        selectTables
    );

    const loading = useSelector(
        selectTableLoading
    );

    const error = useSelector(
        selectTableError
    );

    const creating = useSelector(
        selectCreating
    );

    const createError = useSelector(
        selectCreateError
    );

    const updating = useSelector(
        selectUpdating
    );

    const updateError = useSelector(
        selectUpdateError
    );

    const deleting = useSelector(
        selectDeleting
    );

    const deleteError = useSelector(
        selectDeleteError
    );

    const statusUpdating = useSelector(
        selectStatusUpdating
    );

    const statusUpdateError = useSelector(
        selectStatusUpdateError
    );


    /*
    |--------------------------------------------------------------------------
    | Local UI State
    |--------------------------------------------------------------------------
    */

    const [
        search,
        setSearch,
    ] = useState("");


    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");


    const [
        locationFilter,
        setLocationFilter,
    ] = useState("all");


    const [
        floorFilter,
        setFloorFilter,
    ] = useState("all");


    const [
        showFilters,
        setShowFilters,
    ] = useState(false);


    const [
        refreshing,
        setRefreshing,
    ] = useState(false);


    const [
        showModal,
        setShowModal,
    ] = useState(false);


    const [
        editingTable,
        setEditingTable,
    ] = useState(null);


    const [
        form,
        setForm,
    ] = useState({
        ...EMPTY_FORM,
    });


    const [
        formErrors,
        setFormErrors,
    ] = useState({});


    const [
        openMenuId,
        setOpenMenuId,
    ] = useState(null);


    const [
        deletingId,
        setDeletingId,
    ] = useState(null);


    const [
        statusUpdatingId,
        setStatusUpdatingId,
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Inline Feedback
    |--------------------------------------------------------------------------
    */

    const [
        feedback,
        setFeedback,
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Fetch Tables
    |--------------------------------------------------------------------------
    */

    const loadTables = useCallback(
        async () => {

            try {

                await dispatch(
                    fetchTables()
                ).unwrap();

            } catch (error) {

                console.error(
                    "Fetch tables error:",
                    error
                );

            }
        },
        [dispatch]
    );


    useEffect(() => {

        loadTables();

    }, [
        loadTables,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Auto Clear Feedback
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!feedback) {
            return undefined;
        }

        const timeout =
            window.setTimeout(
                () => {
                    setFeedback(null);
                },
                4000
            );

        return () => {
            window.clearTimeout(
                timeout
            );
        };

    }, [feedback]);


    /*
    |--------------------------------------------------------------------------
    | Derived Locations
    |--------------------------------------------------------------------------
    */

    const locations = useMemo(
        () => {

            return [
                ...new Set(
                    tables
                        .map(
                            (table) =>
                                table?.location
                        )
                        .filter(Boolean)
                ),
            ].sort();

        },
        [tables]
    );


    /*
    |--------------------------------------------------------------------------
    | Derived Floors
    |--------------------------------------------------------------------------
    */

    const floors = useMemo(
        () => {

            return [
                ...new Set(
                    tables
                        .map(
                            (table) =>
                                table?.floor
                        )
                        .filter(
                            (floor) =>
                                floor !==
                                    undefined &&
                                floor !== null &&
                                floor !== ""
                        )
                ),
            ].sort(
                (a, b) =>
                    Number(a) -
                    Number(b)
            );

        },
        [tables]
    );


    /*
    |--------------------------------------------------------------------------
    | Filtered Tables
    |--------------------------------------------------------------------------
    */

    const filteredTables =
        useMemo(
            () => {

                const normalizedSearch =
                    search
                        .trim()
                        .toLowerCase();


                return tables.filter(
                    (table) => {

                        const searchableValues = [
                            table?.tableNumber,
                            table?.tableName,
                            table?.location,
                            table?.floor,
                            table?.status,
                        ];


                        const matchesSearch =
                            !normalizedSearch ||
                            searchableValues.some(
                                (value) =>
                                    String(
                                        value ??
                                            ""
                                    )
                                        .toLowerCase()
                                        .includes(
                                            normalizedSearch
                                        )
                            );


                        const matchesStatus =
                            statusFilter ===
                                "all" ||
                            table?.status ===
                                statusFilter;


                        const matchesLocation =
                            locationFilter ===
                                "all" ||
                            table?.location ===
                                locationFilter;


                        const matchesFloor =
                            floorFilter ===
                                "all" ||
                            String(
                                table?.floor
                            ) ===
                                String(
                                    floorFilter
                                );


                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesLocation &&
                            matchesFloor
                        );
                    }
                );

            },
            [
                tables,
                search,
                statusFilter,
                locationFilter,
                floorFilter,
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const statistics =
        useMemo(
            () => {

                const result = {
                    total: tables.length,
                    available: 0,
                    reserved: 0,
                    occupied: 0,
                    maintenance: 0,
                    inactive: 0,
                };


                tables.forEach(
                    (table) => {

                        switch (
                            table?.status
                        ) {

                            case "Available":
                                result.available += 1;
                                break;

                            case "Reserved":
                                result.reserved += 1;
                                break;

                            case "Occupied":
                                result.occupied += 1;
                                break;

                            case "Maintenance":
                                result.maintenance += 1;
                                break;

                            default:
                                break;
                        }


                        if (
                            table?.isActive ===
                            false
                        ) {
                            result.inactive +=
                                1;
                        }

                    }
                );


                return result;

            },
            [tables]
        );


    /*
    |--------------------------------------------------------------------------
    | Modal Helpers
    |--------------------------------------------------------------------------
    */

    const openCreateModal =
        useCallback(
            () => {

                setEditingTable(
                    null
                );

                setForm({
                    ...EMPTY_FORM,
                });

                setFormErrors({});

                setOpenMenuId(
                    null
                );

                setShowModal(
                    true
                );

            },
            []
        );


    const openEditModal =
        useCallback(
            (table) => {

                if (!table) {
                    return;
                }

                setEditingTable(
                    table
                );

                setForm({
                    tableNumber:
                        table?.tableNumber ??
                        "",

                    tableName:
                        table?.tableName ||
                        "",

                    capacity:
                        table?.capacity ??
                        "",

                    location:
                        table?.location ||
                        "Indoor",

                    floor:
                        table?.floor ??
                        1,

                    status:
                        table?.status ||
                        "Available",

                    isActive:
                        table?.isActive !==
                        false,

                    isMergeable:
                        table?.isMergeable ===
                        true,

                    notes:
                        table?.notes ||
                        "",
                });

                setFormErrors({});

                setOpenMenuId(
                    null
                );

                setShowModal(
                    true
                );

            },
            []
        );


    const closeModal = () => {

        if (
            creating ||
            updating
        ) {
            return;
        }

        setShowModal(
            false
        );

        setEditingTable(
            null
        );

        setForm({
            ...EMPTY_FORM,
        });

        setFormErrors({});
    };


    /*
    |--------------------------------------------------------------------------
    | Form Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;


        setForm(
            (previous) => ({
                ...previous,

                [name]:
                    type ===
                    "checkbox"
                        ? checked
                        : value,
            })
        );


        setFormErrors(
            (previous) => ({
                ...previous,
                [name]: "",
            })
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Form Validation
    |--------------------------------------------------------------------------
    */

    const validateForm =
        () => {

            const errors = {};


            const tableNumber =
                Number(
                    form.tableNumber
                );


            const capacity =
                Number(
                    form.capacity
                );


            const floor =
                Number(
                    form.floor
                );


            if (
                !Number.isInteger(
                    tableNumber
                ) ||
                tableNumber < 1
            ) {
                errors.tableNumber =
                    "Table number must be a positive whole number.";
            }


            if (
                !form.tableName.trim()
            ) {
                errors.tableName =
                    "Table name is required.";
            }


            if (
                !Number.isInteger(
                    capacity
                ) ||
                capacity < 1 ||
                capacity > 50
            ) {
                errors.capacity =
                    "Capacity must be a whole number between 1 and 50.";
            }


            if (
                !TABLE_LOCATIONS.includes(
                    form.location
                )
            ) {
                errors.location =
                    "Please select a valid location.";
            }


            if (
                !Number.isInteger(
                    floor
                ) ||
                floor < 1
            ) {
                errors.floor =
                    "Floor must be a positive whole number.";
            }


            if (
                !TABLE_STATUSES.includes(
                    form.status
                )
            ) {
                errors.status =
                    "Please select a valid status.";
            }


            setFormErrors(
                errors
            );

            return (
                Object.keys(
                    errors
                ).length === 0
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Submit Create / Update
    |--------------------------------------------------------------------------
    */

    const handleSubmit =
        async (
            event
        ) => {

            event.preventDefault();


            if (
                !validateForm()
            ) {
                return;
            }


            const payload = {

                tableNumber:
                    Number(
                        form.tableNumber
                    ),

                tableName:
                    form.tableName.trim(),

                capacity:
                    Number(
                        form.capacity
                    ),

                location:
                    form.location,

                floor:
                    Number(
                        form.floor
                    ),

                status:
                    form.status,

                isActive:
                    Boolean(
                        form.isActive
                    ),

                isMergeable:
                    Boolean(
                        form.isMergeable
                    ),

                notes:
                    form.notes.trim(),

            };


            try {

                if (
                    editingTable
                ) {

                    const tableId =
                        editingTable?._id ||
                        editingTable?.id;


                    if (!tableId) {

                        setFeedback({
                            type: "error",
                            message:
                                "Table ID is missing.",
                        });

                        return;
                    }


                    await dispatch(
                        updateTable({
                            tableId,
                            updates:
                                payload,
                        })
                    ).unwrap();


                    setFeedback({
                        type: "success",
                        message:
                            "Table updated successfully.",
                    });

                } else {

                    await dispatch(
                        createTable(
                            payload
                        )
                    ).unwrap();


                    setFeedback({
                        type: "success",
                        message:
                            "Table created successfully.",
                    });
                }


                setShowModal(
                    false
                );

                setEditingTable(
                    null
                );

                setForm({
                    ...EMPTY_FORM,
                });

                setFormErrors({});

            } catch (
                error
            ) {

                console.error(
                    "Table save error:",
                    error
                );

                setFeedback({
                    type: "error",
                    message:
                        error ||
                        "Unable to save table.",
                });

            }
        };


    /*
    |--------------------------------------------------------------------------
    | Delete Table
    |--------------------------------------------------------------------------
    */

    const handleDelete =
        async (
            table
        ) => {

            const tableId =
                table?._id ||
                table?.id;


            if (!tableId) {

                setFeedback({
                    type: "error",
                    message:
                        "Table ID is missing.",
                });

                return;
            }


            const tableLabel =
                table?.tableName ||
                `Table ${table?.tableNumber || ""}`;


            const confirmed =
                window.confirm(
                    `Delete ${tableLabel}? This will deactivate the table.`
                );


            if (!confirmed) {
                return;
            }


            setDeletingId(
                tableId
            );

            setOpenMenuId(
                null
            );


            try {

                await dispatch(
                    deleteTable(
                        tableId
                    )
                ).unwrap();


                setFeedback({
                    type: "success",
                    message:
                        "Table deleted successfully.",
                });

            } catch (
                error
            ) {

                console.error(
                    "Delete table error:",
                    error
                );

                setFeedback({
                    type: "error",
                    message:
                        error ||
                        "Unable to delete table.",
                });

            } finally {

                setDeletingId(
                    null
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Update Status
    |--------------------------------------------------------------------------
    */

    const handleStatusChange =
        async (
            table,
            status
        ) => {

            const tableId =
                table?._id ||
                table?.id;


            if (
                !tableId ||
                !status
            ) {
                return;
            }


            setStatusUpdatingId(
                tableId
            );

            setOpenMenuId(
                null
            );


            try {

                await dispatch(
                    updateTableStatus({
                        tableId,
                        status,
                    })
                ).unwrap();


                setFeedback({
                    type: "success",
                    message:
                        `${table?.tableName || `Table ${table?.tableNumber || ""}`} marked ${status.toLowerCase()}.`,
                });

            } catch (
                error
            ) {

                console.error(
                    "Status update error:",
                    error
                );

                setFeedback({
                    type: "error",
                    message:
                        error ||
                        "Unable to update table status.",
                });

            } finally {

                setStatusUpdatingId(
                    null
                );
            }
        };


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
                    fetchTables()
                ).unwrap();

                setFeedback({
                    type: "success",
                    message:
                        "Tables refreshed.",
                });

            } catch (
                error
            ) {

                setFeedback({
                    type: "error",
                    message:
                        error ||
                        "Unable to refresh tables.",
                });

            } finally {

                setRefreshing(
                    false
                );
            }
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

            setStatusFilter(
                "all"
            );

            setLocationFilter(
                "all"
            );

            setFloorFilter(
                "all"
            );
        };


    const hasFilters =
        Boolean(
            search.trim()
        ) ||
        statusFilter !==
            "all" ||
        locationFilter !==
            "all" ||
        floorFilter !==
            "all";


    /*
    |--------------------------------------------------------------------------
    | Combined Error
    |--------------------------------------------------------------------------
    */

    const visibleError =
        error ||
        createError ||
        updateError ||
        deleteError ||
        statusUpdateError;


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

            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                        <Table2 className="h-4 w-4" />

                        <span>
                            Restaurant Tables
                        </span>

                    </div>


                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        Table Management
                    </h1>


                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage table configuration, availability,
                        seating capacity, and operational status.
                    </p>

                </div>


                <div className="flex flex-wrap items-center gap-3">

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
                            hover:border-slate-300
                            hover:bg-slate-50
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        <RefreshCw
                            className={`h-4 w-4 ${
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Refresh

                    </button>


                    <button
                        type="button"
                        onClick={
                            openCreateModal
                        }
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

                        Add Table

                    </button>

                </div>

            </section>


            {/* =========================================================
                Feedback
            ========================================================= */}

            {feedback && (

                <div
                    className={`
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        px-4
                        py-3
                        text-sm
                        ${
                            feedback.type ===
                            "success"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-red-200 bg-red-50 text-red-800"
                        }
                    `}
                >

                    {feedback.type ===
                    "success" ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}

                    <span>
                        {feedback.message}
                    </span>

                </div>

            )}


            {/* =========================================================
                API Error
            ========================================================= */}

            {visibleError && !feedback && (

                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <span>
                        {visibleError}
                    </span>

                </div>

            )}


            {/* =========================================================
                Statistics
            ========================================================= */}

            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">

                <StatCard
                    title="Total"
                    value={
                        statistics.total
                    }
                    icon={
                        Table2
                    }
                />

                <StatCard
                    title="Available"
                    value={
                        statistics.available
                    }
                    icon={
                        CheckCircle2
                    }
                />

                <StatCard
                    title="Reserved"
                    value={
                        statistics.reserved
                    }
                    icon={
                        CalendarCheck
                    }
                />

                <StatCard
                    title="Occupied"
                    value={
                        statistics.occupied
                    }
                    icon={
                        Users
                    }
                />

                <StatCard
                    title="Maintenance"
                    value={
                        statistics.maintenance
                    }
                    icon={
                        Loader2
                    }
                />

                <StatCard
                    title="Inactive"
                    value={
                        statistics.inactive
                    }
                    icon={
                        X
                    }
                />

            </section>


            {/* =========================================================
                Search + Filters
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
                            placeholder="Search table number, name, location, floor..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                py-2.5
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
                                (previous) =>
                                    !previous
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
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

                    <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-3">

                        <FilterSelect
                            label="Status"
                            value={
                                statusFilter
                            }
                            onChange={
                                setStatusFilter
                            }
                            options={[
                                {
                                    value: "all",
                                    label:
                                        "All statuses",
                                },

                                ...TABLE_STATUSES.map(
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
                            label="Location"
                            value={
                                locationFilter
                            }
                            onChange={
                                setLocationFilter
                            }
                            options={[
                                {
                                    value: "all",
                                    label:
                                        "All locations",
                                },

                                ...locations.map(
                                    (
                                        location
                                    ) => ({
                                        value:
                                            location,
                                        label:
                                            location,
                                    })
                                ),
                            ]}
                        />


                        <FilterSelect
                            label="Floor"
                            value={
                                floorFilter
                            }
                            onChange={
                                setFloorFilter
                            }
                            options={[
                                {
                                    value: "all",
                                    label:
                                        "All floors",
                                },

                                ...floors.map(
                                    (
                                        floor
                                    ) => ({
                                        value:
                                            floor,
                                        label:
                                            `Floor ${floor}`,
                                    })
                                ),
                            ]}
                        />

                    </div>

                )}


                {hasFilters && (

                    <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-xs text-slate-500">

                            Showing{" "}

                            <span className="font-semibold text-slate-700">
                                {
                                    filteredTables.length
                                }
                            </span>

                            {" "}of{" "}

                            <span className="font-semibold text-slate-700">
                                {
                                    tables.length
                                }
                            </span>

                            {" "}tables

                        </p>


                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="text-left text-xs font-semibold text-blue-600 hover:text-blue-700 sm:text-right"
                        >
                            Clear filters
                        </button>

                    </div>

                )}

            </section>


            {/* =========================================================
                Table List
            ========================================================= */}

            <section className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Desktop Header */}

                <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 lg:grid lg:grid-cols-[70px_1.4fr_1fr_1fr_1fr_1fr_70px] lg:items-center lg:gap-4">

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        #
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Table
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Capacity
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Location
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Activity
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                    </span>

                </div>


                {loading &&
                tables.length === 0 ? (

                    <LoadingState />

                ) : filteredTables.length ===
                  0 ? (

                    <EmptyTableState
                        hasFilters={
                            hasFilters
                        }
                        onCreate={
                            openCreateModal
                        }
                        onClear={
                            clearFilters
                        }
                    />

                ) : (

                    <div className="divide-y divide-slate-100">

                        {filteredTables.map(
                            (
                                table
                            ) => (

                                <TableRow
                                    key={
                                        table?._id ||
                                        table?.id
                                    }
                                    table={
                                        table
                                    }
                                    openMenuId={
                                        openMenuId
                                    }
                                    setOpenMenuId={
                                        setOpenMenuId
                                    }
                                    onEdit={
                                        openEditModal
                                    }
                                    onDelete={
                                        handleDelete
                                    }
                                    onStatusChange={
                                        handleStatusChange
                                    }
                                    deletingId={
                                        deletingId
                                    }
                                    statusUpdatingId={
                                        statusUpdatingId
                                    }
                                />

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =========================================================
                Modal
            ========================================================= */}

            {showModal && (

                <TableModal
                    editingTable={
                        editingTable
                    }
                    form={
                        form
                    }
                    formErrors={
                        formErrors
                    }
                    onChange={
                        handleChange
                    }
                    onSubmit={
                        handleSubmit
                    }
                    onClose={
                        closeModal
                    }
                    submitting={
                        creating ||
                        updating
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
    title,
    value,
    icon: Icon,
}) => {

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">

                    <p className="truncate text-xs font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-950">
                        {value}
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
                                    String(
                                        option.value
                                    )
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
| Table Row
|--------------------------------------------------------------------------
*/

const TableRow = ({
    table,
    openMenuId,
    setOpenMenuId,
    onEdit,
    onDelete,
    onStatusChange,
    deletingId,
    statusUpdatingId,
}) => {

    const tableId =
        table?._id ||
        table?.id;


    const menuOpen =
        openMenuId ===
        tableId;


    const isDeleting =
        deletingId ===
        tableId;


    const isUpdatingStatus =
        statusUpdatingId ===
        tableId;


    return (
        <div className="relative px-5 py-4">

            {/* Desktop */}

            <div className="hidden lg:grid lg:grid-cols-[70px_1.4fr_1fr_1fr_1fr_1fr_70px] lg:items-center lg:gap-4">

                <div className="text-sm font-semibold text-slate-500">
                    {table?.tableNumber ??
                        "—"}
                </div>


                <TableIdentity
                    table={
                        table
                    }
                />


                <Capacity
                    value={
                        table?.capacity
                    }
                />


                <div className="text-sm text-slate-600">

                    <p>
                        {
                            table?.location ||
                            "—"
                        }
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                        Floor{" "}
                        {
                            table?.floor ??
                            "—"
                        }
                    </p>

                </div>


                <StatusBadge
                    status={
                        table?.status
                    }
                />


                <ActiveBadge
                    isActive={
                        table?.isActive !==
                        false
                    }
                />


                <TableActions
                    table={
                        table
                    }
                    menuOpen={
                        menuOpen
                    }
                    setMenuOpen={
                        setOpenMenuId
                    }
                    onEdit={
                        onEdit
                    }
                    onDelete={
                        onDelete
                    }
                    onStatusChange={
                        onStatusChange
                    }
                    isDeleting={
                        isDeleting
                    }
                    isUpdatingStatus={
                        isUpdatingStatus
                    }
                />

            </div>


            {/* Mobile */}

            <div className="lg:hidden">

                <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                        {table?.tableNumber ??
                            "—"}
                    </div>


                    <div className="min-w-0 flex-1">

                        <TableIdentity
                            table={
                                table
                            }
                        />

                    </div>


                    <TableActions
                        table={
                            table
                        }
                        menuOpen={
                            menuOpen
                        }
                        setMenuOpen={
                            setOpenMenuId
                        }
                        onEdit={
                            onEdit
                        }
                        onDelete={
                            onDelete
                        }
                        onStatusChange={
                            onStatusChange
                        }
                        isDeleting={
                            isDeleting
                        }
                        isUpdatingStatus={
                            isUpdatingStatus
                        }
                    />

                </div>


                <div className="mt-4 grid grid-cols-2 gap-3">

                    <InfoItem
                        label="Capacity"
                        value={
                            `${table?.capacity || 0} guests`
                        }
                    />


                    <InfoItem
                        label="Location"
                        value={
                            table?.location ||
                            "—"
                        }
                    />


                    <InfoItem
                        label="Floor"
                        value={
                            table?.floor ??
                            "—"
                        }
                    />


                    <InfoItem
                        label="Status"
                        value={
                            <StatusBadge
                                status={
                                    table?.status
                                }
                            />
                        }
                    />


                    <InfoItem
                        label="Activity"
                        value={
                            <ActiveBadge
                                isActive={
                                    table?.isActive !==
                                    false
                                }
                            />
                        }
                    />

                </div>

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Table Identity
|--------------------------------------------------------------------------
*/

const TableIdentity = ({
    table,
}) => {

    return (
        <div className="flex min-w-0 items-center gap-3">

            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 lg:flex">

                <Table2 className="h-5 w-5" />

            </div>


            <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-slate-900">
                    {table?.tableName ||
                        "Unnamed Table"}
                </p>


                <div className="mt-1 flex flex-wrap items-center gap-2">

                    {table?.isMergeable && (
                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                            Mergeable
                        </span>
                    )}


                    {table?.isActive ===
                        false && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                            Inactive
                        </span>
                    )}

                </div>

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Capacity
|--------------------------------------------------------------------------
*/

const Capacity = ({
    value,
}) => {

    return (
        <div className="flex items-center gap-2 text-sm text-slate-600">

            <Users className="h-4 w-4 text-slate-400" />

            <span>
                {value || 0}
            </span>

            <span className="text-xs text-slate-400">
                guests
            </span>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Info Item
|--------------------------------------------------------------------------
*/

const InfoItem = ({
    label,
    value,
}) => {

    return (
        <div className="rounded-xl bg-slate-50 p-3">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <div className="mt-1 text-sm font-medium text-slate-700">
                {value}
            </div>

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

        Available:
            "bg-emerald-50 text-emerald-700",

        Reserved:
            "bg-blue-50 text-blue-700",

        Occupied:
            "bg-amber-50 text-amber-700",

        Maintenance:
            "bg-red-50 text-red-700",

    };


    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2.5
                py-1
                text-[11px]
                font-semibold
                ${styles[status] ||
                    "bg-slate-100 text-slate-600"}
            `}
        >
            {status ||
                "Unknown"}
        </span>
    );
};


/*
|--------------------------------------------------------------------------
| Active Badge
|--------------------------------------------------------------------------
*/

const ActiveBadge = ({
    isActive,
}) => {

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
                    isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                }
            `}
        >
            {isActive
                ? "Active"
                : "Inactive"}
        </span>
    );
};


/*
|--------------------------------------------------------------------------
| Table Actions
|--------------------------------------------------------------------------
*/

const TableActions = ({
    table,
    menuOpen,
    setMenuOpen,
    onEdit,
    onDelete,
    onStatusChange,
    isDeleting,
    isUpdatingStatus,
}) => {

    const tableId =
        table?._id ||
        table?.id;


    return (
        <div className="relative flex justify-end">

            <button
                type="button"
                onClick={() =>
                    setMenuOpen(
                        menuOpen
                            ? null
                            : tableId
                    )
                }
                className="
                    rounded-lg
                    p-2
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                "
                aria-label={
                    `Actions for ${
                        table?.tableName ||
                        `Table ${table?.tableNumber || ""}`
                    }`
                }
            >

                <MoreHorizontal className="h-5 w-5" />

            </button>


            {menuOpen && (

                <div className="absolute right-0 top-10 z-40 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">

                    {/* Edit */}

                    <button
                        type="button"
                        onClick={() =>
                            onEdit(
                                table
                            )
                        }
                        className="
                            flex
                            w-full
                            items-center
                            gap-3
                            px-3
                            py-2.5
                            text-left
                            text-sm
                            text-slate-700
                            transition
                            hover:bg-slate-50
                        "
                    >

                        <Edit3 className="h-4 w-4" />

                        Edit table

                    </button>


                    {/* Status */}

                    <div className="border-t border-slate-100 px-3 py-2">

                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Change status
                        </p>


                        {TABLE_STATUSES.map(
                            (
                                status
                            ) => (

                                <button
                                    key={
                                        status
                                    }
                                    type="button"
                                    disabled={
                                        isUpdatingStatus ||
                                        table?.status ===
                                            status
                                    }
                                    onClick={() =>
                                        onStatusChange(
                                            table,
                                            status
                                        )
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        rounded-lg
                                        px-2
                                        py-1.5
                                        text-left
                                        text-xs
                                        text-slate-600
                                        transition
                                        hover:bg-slate-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >

                                    <span>
                                        {
                                            status
                                        }
                                    </span>


                                    {table?.status ===
                                        status && (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                    )}

                                </button>

                            )
                        )}

                    </div>


                    {/* Delete */}

                    <div className="border-t border-slate-100">

                        <button
                            type="button"
                            disabled={
                                isDeleting
                            }
                            onClick={() =>
                                onDelete(
                                    table
                                )
                            }
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                text-red-600
                                transition
                                hover:bg-red-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}

                            Delete table

                        </button>

                    </div>

                </div>

            )}

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Loading State
|--------------------------------------------------------------------------
*/

const LoadingState = () => {

    return (
        <div className="flex min-h-72 flex-col items-center justify-center p-8">

            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />

            <p className="mt-3 text-sm font-medium text-slate-700">
                Loading tables...
            </p>

            <p className="mt-1 text-xs text-slate-400">
                Getting the latest table information.
            </p>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

const EmptyTableState = ({
    hasFilters,
    onCreate,
    onClear,
}) => {

    return (
        <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                <Table2 className="h-6 w-6" />

            </div>


            <h3 className="mt-4 text-sm font-semibold text-slate-900">

                {hasFilters
                    ? "No matching tables"
                    : "No tables yet"}

            </h3>


            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">

                {hasFilters
                    ? "Try changing your search or filters."
                    : "Create your first restaurant table to start managing availability."}

            </p>


            <div className="mt-4">

                {hasFilters ? (

                    <button
                        type="button"
                        onClick={
                            onClear
                        }
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Clear filters
                    </button>

                ) : (

                    <button
                        type="button"
                        onClick={
                            onCreate
                        }
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
                            transition
                            hover:bg-blue-700
                        "
                    >

                        <Plus className="h-4 w-4" />

                        Add Table

                    </button>

                )}

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Table Modal
|--------------------------------------------------------------------------
*/

const TableModal = ({
    editingTable,
    form,
    formErrors,
    onChange,
    onSubmit,
    onClose,
    submitting,
}) => {

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-slate-950/50
                p-4
                backdrop-blur-sm
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="table-modal-title"
        >

            <button
                type="button"
                aria-label="Close modal"
                className="absolute inset-0 cursor-default"
                onClick={
                    onClose
                }
            />


            <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">

                {/* Header */}

                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">

                    <div>

                        <h2
                            id="table-modal-title"
                            className="text-lg font-bold text-slate-950"
                        >
                            {editingTable
                                ? "Edit Table"
                                : "Create Table"}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {editingTable
                                ? "Update the table configuration and operational settings."
                                : "Add a new table to your restaurant."}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            submitting
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                        aria-label="Close"
                    >

                        <X className="h-5 w-5" />

                    </button>

                </div>


                {/* Form */}

                <form
                    onSubmit={
                        onSubmit
                    }
                >

                    <div className="space-y-5 p-5 sm:p-6">

                        {/* Table Number */}

                        <FormField
                            label="Table Number"
                            required
                            error={
                                formErrors.tableNumber
                            }
                        >

                            <input
                                id="tableNumber"
                                name="tableNumber"
                                type="number"
                                min="1"
                                step="1"
                                value={
                                    form.tableNumber
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    submitting
                                }
                                placeholder="e.g. 12"
                                className={getInputClass(
                                    formErrors.tableNumber
                                )}
                            />

                        </FormField>


                        {/* Table Name */}

                        <FormField
                            label="Table Name"
                            required
                            error={
                                formErrors.tableName
                            }
                        >

                            <input
                                id="tableName"
                                name="tableName"
                                type="text"
                                maxLength="50"
                                value={
                                    form.tableName
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    submitting
                                }
                                placeholder="e.g. Window Table"
                                className={getInputClass(
                                    formErrors.tableName
                                )}
                            />

                        </FormField>


                        {/* Capacity */}

                        <FormField
                            label="Capacity"
                            required
                            error={
                                formErrors.capacity
                            }
                        >

                            <input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min="1"
                                max="50"
                                step="1"
                                value={
                                    form.capacity
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    submitting
                                }
                                placeholder="e.g. 4"
                                className={getInputClass(
                                    formErrors.capacity
                                )}
                            />

                        </FormField>


                        {/* Location / Floor */}

                        <div className="grid gap-5 sm:grid-cols-2">

                            <FormField
                                label="Location"
                                required
                                error={
                                    formErrors.location
                                }
                            >

                                <div className="relative">

                                    <select
                                        name="location"
                                        value={
                                            form.location
                                        }
                                        onChange={
                                            onChange
                                        }
                                        disabled={
                                            submitting
                                        }
                                        className={`
                                            ${getInputClass(
                                                formErrors.location
                                            )}
                                            appearance-none
                                            pr-9
                                        `}
                                    >

                                        {TABLE_LOCATIONS.map(
                                            (
                                                location
                                            ) => (

                                                <option
                                                    key={
                                                        location
                                                    }
                                                    value={
                                                        location
                                                    }
                                                >
                                                    {
                                                        location
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>


                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                </div>

                            </FormField>


                            <FormField
                                label="Floor"
                                required
                                error={
                                    formErrors.floor
                                }
                            >

                                <input
                                    name="floor"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={
                                        form.floor
                                    }
                                    onChange={
                                        onChange
                                    }
                                    disabled={
                                        submitting
                                    }
                                    placeholder="1"
                                    className={getInputClass(
                                        formErrors.floor
                                    )}
                                />

                            </FormField>

                        </div>


                        {/* Status */}

                        <FormField
                            label="Status"
                            required
                            error={
                                formErrors.status
                            }
                        >

                            <div className="relative">

                                <select
                                    name="status"
                                    value={
                                        form.status
                                    }
                                    onChange={
                                        onChange
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className={`
                                        ${getInputClass(
                                            formErrors.status
                                        )}
                                        appearance-none
                                        pr-9
                                    `}
                                >

                                    {TABLE_STATUSES.map(
                                        (
                                            status
                                        ) => (

                                            <option
                                                key={
                                                    status
                                                }
                                                value={
                                                    status
                                                }
                                            >
                                                {
                                                    status
                                                }
                                            </option>

                                        )
                                    )}

                                </select>


                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            </div>

                        </FormField>


                        {/* Options */}

                        <div className="grid gap-3 sm:grid-cols-2">

                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30">

                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={
                                        form.isActive
                                    }
                                    onChange={
                                        onChange
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />

                                <span>

                                    <span className="block text-sm font-semibold text-slate-800">
                                        Active table
                                    </span>

                                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                                        Available for normal restaurant operations.
                                    </span>

                                </span>

                            </label>


                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-violet-200 hover:bg-violet-50/30">

                                <input
                                    type="checkbox"
                                    name="isMergeable"
                                    checked={
                                        form.isMergeable
                                    }
                                    onChange={
                                        onChange
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                />

                                <span>

                                    <span className="block text-sm font-semibold text-slate-800">
                                        Mergeable table
                                    </span>

                                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                                        Can be combined with another table.
                                    </span>

                                </span>

                            </label>

                        </div>


                        {/* Notes */}

                        <FormField
                            label="Notes"
                            helperText="Optional internal notes."
                            error={
                                formErrors.notes
                            }
                        >

                            <textarea
                                name="notes"
                                rows="4"
                                maxLength="500"
                                value={
                                    form.notes
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    submitting
                                }
                                placeholder="Add internal notes about this table..."
                                className={`
                                    ${getInputClass(
                                        formErrors.notes
                                    )}
                                    resize-none
                                `}
                            />

                        </FormField>

                    </div>


                    {/* Footer */}

                    <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                submitting
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                submitting
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
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
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {submitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {editingTable
                                ? "Save Changes"
                                : "Create Table"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Form Field
|--------------------------------------------------------------------------
*/

const FormField = ({
    label,
    required,
    error,
    helperText,
    children,
}) => {

    return (
        <label className="block">

            <span className="mb-1.5 block text-sm font-semibold text-slate-700">

                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}

            </span>


            {children}


            {error ? (
                <span className="mt-1.5 block text-xs font-medium text-red-600">
                    {error}
                </span>
            ) : helperText ? (
                <span className="mt-1.5 block text-xs text-slate-400">
                    {helperText}
                </span>
            ) : null}

        </label>
    );
};


/*
|--------------------------------------------------------------------------
| Input Classes
|--------------------------------------------------------------------------
*/

const getInputClass = (
    error
) => {

    return `
        w-full
        rounded-xl
        border
        bg-white
        px-3
        py-2.5
        text-sm
        text-slate-900
        outline-none
        transition
        placeholder:text-slate-400
        disabled:cursor-not-allowed
        disabled:bg-slate-50
        ${
            error
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }
    `;
};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default Tables;




// import {
//     CheckCircle2,
//     ChevronDown,
//     CalendarCheck,
//     Edit3,
//     Filter,
//     Loader2,
//     MoreHorizontal,
//     Plus,
//     RefreshCw,
//     Search,
//     Table2,
//     Trash2,
//     Users,
//     X,
// } from "lucide-react";

// import {
//     useCallback,
//     useEffect,
//     useMemo,
//     useState,
// } from "react";

// import {
//     useDispatch,
//     useSelector,
// } from "react-redux";

// import {
//     fetchTables,
//     addTable,
//     updateTable,
//     removeTable,
//     updateTableStatus,

//     selectTables,
//     selectTableLoading,
//     selectTableError,
// } from "../features/tableSlice.js";


// /*
// |--------------------------------------------------------------------------
// | Constants
// |--------------------------------------------------------------------------
// */

// const TABLE_STATUSES = [
//     "available",
//     "reserved",
//     "occupied",
//     "maintenance",
// ];

// const EMPTY_FORM = {
//     tableName: "",
//     capacity: "",
//     location: "",
//     floor: "",
//     status: "available",
//     isActive: true,
//     isMergeable: false,
//     notes: "",
// };


// /*
// |--------------------------------------------------------------------------
// | Table Page
// |--------------------------------------------------------------------------
// */

// const Tables = () => {

//     const dispatch = useDispatch();


//     /*
//     |--------------------------------------------------------------------------
//     | Redux State
//     |--------------------------------------------------------------------------
//     */

//     const tables = useSelector(selectTables);

//     const loading = useSelector(
//         selectTableLoading
//     );

//     const error = useSelector(
//         selectTableError
//     );


//     /*
//     |--------------------------------------------------------------------------
//     | Local State
//     |--------------------------------------------------------------------------
//     */

//     const [search, setSearch] = useState("");

//     const [statusFilter, setStatusFilter] =
//         useState("all");

//     const [locationFilter, setLocationFilter] =
//         useState("all");

//     const [floorFilter, setFloorFilter] =
//         useState("all");

//     const [showFilters, setShowFilters] =
//         useState(false);

//     const [refreshing, setRefreshing] =
//         useState(false);

//     const [showModal, setShowModal] =
//         useState(false);

//     const [editingTable, setEditingTable] =
//         useState(null);

//     const [form, setForm] =
//         useState(EMPTY_FORM);

//     const [submitting, setSubmitting] =
//         useState(false);

//     const [deletingId, setDeletingId] =
//         useState(null);

//     const [statusUpdatingId, setStatusUpdatingId] =
//         useState(null);

//     const [openMenuId, setOpenMenuId] =
//         useState(null);


//     /*
//     |--------------------------------------------------------------------------
//     | Initial Fetch
//     |--------------------------------------------------------------------------
//     */

//     useEffect(() => {
//         dispatch(
//             fetchTables()
//         );
//     }, [dispatch]);


//     /*
//     |--------------------------------------------------------------------------
//     | Refresh
//     |--------------------------------------------------------------------------
//     */

//     const handleRefresh = useCallback(
//         async () => {

//             setRefreshing(true);

//             try {

//                 await dispatch(
//                     fetchTables()
//                 )
//                 // .unwrap();

//             } catch (error) {

//                 console.error(
//                     "Table refresh error:",
//                     error
//                 );

//             } finally {

//                 setRefreshing(false);

//             }

//         },
//         [dispatch]
//     );


//     /*
//     |--------------------------------------------------------------------------
//     | Unique Locations
//     |--------------------------------------------------------------------------
//     */

//     const locations = useMemo(() => {

//         return [
//             ...new Set(
//                 tables
//                     .map(
//                         (table) =>
//                             table?.location
//                     )
//                     .filter(Boolean)
//             ),
//         ].sort();

//     }, [tables]);


//     /*
//     |--------------------------------------------------------------------------
//     | Unique Floors
//     |--------------------------------------------------------------------------
//     */

//     const floors = useMemo(() => {

//         return [
//             ...new Set(
//                 tables
//                     .map(
//                         (table) =>
//                             table?.floor
//                     )
//                     .filter(
//                         (floor) =>
//                             floor !==
//                             undefined &&
//                             floor !== null &&
//                             floor !== ""
//                     )
//             ),
//         ].sort(
//             (a, b) =>
//                 String(a).localeCompare(
//                     String(b),
//                     undefined,
//                     {
//                         numeric: true,
//                     }
//                 )
//         );

//     }, [tables]);


//     /*
//     |--------------------------------------------------------------------------
//     | Filtered Tables
//     |--------------------------------------------------------------------------
//     */

//     const filteredTables = useMemo(() => {

//         const normalizedSearch =
//             search
//                 .trim()
//                 .toLowerCase();


//         return tables.filter(
//             (table) => {

//                 /*
//                 |--------------------------------------------------------------
//                 | Search
//                 |--------------------------------------------------------------
//                 */

//                 const matchesSearch =
//                     !normalizedSearch ||
//                     String(
//                         table?.tableName || ""
//                     )
//                         .toLowerCase()
//                         .includes(
//                             normalizedSearch
//                         ) ||
//                     String(
//                         table?.location || ""
//                     )
//                         .toLowerCase()
//                         .includes(
//                             normalizedSearch
//                         ) ||
//                     String(
//                         table?.floor || ""
//                     )
//                         .toLowerCase()
//                         .includes(
//                             normalizedSearch
//                         );


//                 /*
//                 |--------------------------------------------------------------
//                 | Status
//                 |--------------------------------------------------------------
//                 */

//                 const matchesStatus =
//                     statusFilter === "all" ||
//                     table?.status ===
//                         statusFilter;


//                 /*
//                 |--------------------------------------------------------------
//                 | Location
//                 |--------------------------------------------------------------
//                 */

//                 const matchesLocation =
//                     locationFilter === "all" ||
//                     table?.location ===
//                         locationFilter;


//                 /*
//                 |--------------------------------------------------------------
//                 | Floor
//                 |--------------------------------------------------------------
//                 */

//                 const matchesFloor =
//                     floorFilter === "all" ||
//                     String(
//                         table?.floor
//                     ) ===
//                         String(
//                             floorFilter
//                         );


//                 return (
//                     matchesSearch &&
//                     matchesStatus &&
//                     matchesLocation &&
//                     matchesFloor
//                 );
//             }
//         );

//     }, [
//         tables,
//         search,
//         statusFilter,
//         locationFilter,
//         floorFilter,
//     ]);


//     /*
//     |--------------------------------------------------------------------------
//     | Statistics
//     |--------------------------------------------------------------------------
//     */

//     const statistics = useMemo(() => {

//         const result = {
//             total: tables.length,
//             available: 0,
//             reserved: 0,
//             occupied: 0,
//             maintenance: 0,
//             inactive: 0,
//         };


//         tables.forEach(
//             (table) => {

//                 const status =
//                     table?.status
//                         ?.toLowerCase();


//                 if (
//                     status ===
//                     "available"
//                 ) {
//                     result.available += 1;
//                 }


//                 if (
//                     status ===
//                     "reserved"
//                 ) {
//                     result.reserved += 1;
//                 }


//                 if (
//                     status ===
//                     "occupied"
//                 ) {
//                     result.occupied += 1;
//                 }


//                 if (
//                     status ===
//                     "maintenance"
//                 ) {
//                     result.maintenance += 1;
//                 }


//                 if (
//                     table?.isActive ===
//                     false
//                 ) {
//                     result.inactive += 1;
//                 }

//             }
//         );


//         return result;

//     }, [tables]);


//     /*
//     |--------------------------------------------------------------------------
//     | Open Create Modal
//     |--------------------------------------------------------------------------
//     */

//     const handleCreate = () => {

//         setEditingTable(null);

//         setForm({
//             ...EMPTY_FORM,
//         });

//         setOpenMenuId(null);

//         setShowModal(true);
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | Open Edit Modal
//     |--------------------------------------------------------------------------
//     */

//     const handleEdit = (
//         table
//     ) => {

//         setEditingTable(table);

//         setForm({
//             tableName:
//                 table?.tableName || "",

//             capacity:
//                 table?.capacity ?? "",

//             location:
//                 table?.location || "",

//             floor:
//                 table?.floor ?? "",

//             status:
//                 table?.status ||
//                 "available",

//             isActive:
//                 table?.isActive !== false,

//             isMergeable:
//                 table?.isMergeable === true,

//             notes:
//                 table?.notes || "",
//         });

//         setOpenMenuId(null);

//         setShowModal(true);
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | Close Modal
//     |--------------------------------------------------------------------------
//     */

//     const handleCloseModal = () => {

//         if (submitting) {
//             return;
//         }

//         setShowModal(false);

//         setEditingTable(null);

//         setForm({
//             ...EMPTY_FORM,
//         });
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | Form Change
//     |--------------------------------------------------------------------------
//     */

//     const handleChange = (
//         event
//     ) => {

//         const {
//             name,
//             value,
//             type,
//             checked,
//         } = event.target;


//         setForm(
//             (previous) => ({
//                 ...previous,

//                 [name]:
//                     type === "checkbox"
//                         ? checked
//                         : value,
//             })
//         );
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | Submit
//     |--------------------------------------------------------------------------
//     */

//     const handleSubmit = async (
//         event
//     ) => {

//         event.preventDefault();


//         /*
//         |----------------------------------------------------------------------
//         | Basic Validation
//         |----------------------------------------------------------------------
//         */

//         if (
//             !form.tableName.trim()
//         ) {
//             alert(
//                 "Table name is required."
//             );

//             return;
//         }


//         if (
//             !form.capacity ||
//             Number(form.capacity) <= 0
//         ) {
//             alert(
//                 "Capacity must be greater than 0."
//             );

//             return;
//         }


//         setSubmitting(true);


//         try {

//             const payload = {
//                 tableName:
//                     form.tableName.trim(),

//                 capacity:
//                     Number(
//                         form.capacity
//                     ),

//                 location:
//                     form.location.trim(),

//                 floor:
//                     form.floor,

//                 status:
//                     form.status,

//                 isActive:
//                     form.isActive,

//                 isMergeable:
//                     form.isMergeable,

//                 notes:
//                     form.notes.trim(),
//             };


//             /*
//             |------------------------------------------------------------------
//             | Update
//             |------------------------------------------------------------------
//             */

//             if (editingTable) {

//                 const tableId =
//                     editingTable?._id ||
//                     editingTable?.id;


//                 await dispatch(
//                     updateTable({
//                         tableId,
//                         updates:
//                             payload,
//                     })
//                 )
//                 // .unwrap();

//             }

//             /*
//             |------------------------------------------------------------------
//             | Create
//             |------------------------------------------------------------------
//             */

//             else {

//                 await dispatch(
//                     addTable(
//                         payload
//                     )
//                 )
//                 // .unwrap();


//             }


//             /*
//             |------------------------------------------------------------------
//             | Close
//             |------------------------------------------------------------------
//             */

//             setShowModal(false);

//             setEditingTable(null);

//             setForm({
//                 ...EMPTY_FORM,
//             });


//             /*
//             |------------------------------------------------------------------
//             | Refresh
//             |------------------------------------------------------------------
//             */

//             await dispatch(
//                 fetchTables()
//             )
//             .unwrap();

//         } catch (error) {

//             console.error(
//                 "Table save error:",
//                 error
//             );

//             alert(
//                 error ||
//                 "Unable to save table."
//             );

//         } finally {

//             setSubmitting(false);

//         }
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | Delete Table
//     |--------------------------------------------------------------------------
//     */

//     const handleDelete = async (
//         table
//     ) => {

//         const tableId =
//             table?._id ||
//             table?.id;


//         if (!tableId) {
//             return;
//         }


//         const confirmed =
//             window.confirm(
//                 `Are you sure you want to delete "${table?.tableName || "this table"}"?`
//             );


//         if (!confirmed) {
//             return;
//         }


//         setDeletingId(
//             tableId
//         );

//         setOpenMenuId(null);


//         try {

//             await dispatch(
//                 removeTable(
//                     tableId
//                 )
//             ).unwrap();


//             await dispatch(
//                 fetchTables()
//             ).unwrap();

//         } catch (error) {

//             console.error(
//                 "Delete table error:",
//                 error
//             );

//             alert(
//                 error ||
//                 "Unable to delete table."
//             );

//         } finally {

//             setDeletingId(null);

//         }
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | Update Status
//     |--------------------------------------------------------------------------
//     */

//     const handleStatusChange = async (
//         table,
//         status
//     ) => {

//         const tableId =
//             table?._id ||
//             table?.id;


//         if (
//             !tableId ||
//             !status
//         ) {
//             return;
//         }


//         setStatusUpdatingId(
//             tableId
//         );

//         setOpenMenuId(null);


//         try {

//             await dispatch(
//                 updateTableStatus({
//                     tableId,
//                     status,
//                 })
//             ).unwrap();


//             await dispatch(
//                 fetchTables()
//             ).unwrap();

//         } catch (error) {

//             console.error(
//                 "Table status update error:",
//                 error
//             );

//             alert(
//                 error ||
//                 "Unable to update table status."
//             );

//         } finally {

//             setStatusUpdatingId(
//                 null
//             );

//         }
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | Clear Filters
//     |--------------------------------------------------------------------------
//     */

//     const clearFilters = () => {

//         setSearch("");

//         setStatusFilter(
//             "all"
//         );

//         setLocationFilter(
//             "all"
//         );

//         setFloorFilter(
//             "all"
//         );
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | Active Filters
//     |--------------------------------------------------------------------------
//     */

//     const hasFilters =
//         Boolean(search) ||
//         statusFilter !== "all" ||
//         locationFilter !== "all" ||
//         floorFilter !== "all";


//     /*
//     |--------------------------------------------------------------------------
//     | Render
//     |--------------------------------------------------------------------------
//     */

//     return (
//         <div className="space-y-6">

//             {/* =========================================================
//                 Header
//             ========================================================= */}

//             <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

//                 <div>

//                     <div className="flex items-center gap-2 text-sm text-slate-500">

//                         <Table2 className="h-4 w-4" />

//                         <span>
//                             Restaurant Tables
//                         </span>

//                     </div>

//                     <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
//                         Table Management
//                     </h1>

//                     <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//                         Create, manage, and monitor your restaurant tables.
//                     </p>

//                 </div>


//                 <div className="flex flex-wrap items-center gap-3">

//                     <button
//                         type="button"
//                         onClick={handleRefresh}
//                         disabled={
//                             refreshing ||
//                             loading
//                         }
//                         className="
//                             inline-flex
//                             items-center
//                             gap-2
//                             rounded-xl
//                             border
//                             border-slate-200
//                             bg-white
//                             px-4
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-slate-700
//                             shadow-sm
//                             transition
//                             hover:border-slate-300
//                             hover:bg-slate-50
//                             disabled:cursor-not-allowed
//                             disabled:opacity-60
//                         "
//                     >

//                         <RefreshCw
//                             className={`h-4 w-4 ${
//                                 refreshing
//                                     ? "animate-spin"
//                                     : ""
//                             }`}
//                         />

//                         Refresh

//                     </button>


//                     <button
//                         type="button"
//                         onClick={handleCreate}
//                         className="
//                             inline-flex
//                             items-center
//                             gap-2
//                             rounded-xl
//                             bg-blue-600
//                             px-4
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-white
//                             shadow-sm
//                             transition
//                             hover:bg-blue-700
//                             focus:outline-none
//                             focus:ring-2
//                             focus:ring-blue-500
//                             focus:ring-offset-2
//                         "
//                     >

//                         <Plus className="h-4 w-4" />

//                         Add Table

//                     </button>

//                 </div>

//             </section>


//             {/* =========================================================
//                 Error
//             ========================================================= */}

//             {error && (

//                 <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

//                     {error}

//                 </div>

//             )}


//             {/* =========================================================
//                 Statistics
//             ========================================================= */}

//             <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">

//                 <StatCard
//                     title="Total"
//                     value={statistics.total}
//                     icon={Table2}
//                 />

//                 <StatCard
//                     title="Available"
//                     value={statistics.available}
//                     icon={CheckCircle2}
//                 />

//                 <StatCard
//                     title="Reserved"
//                     value={statistics.reserved}
//                     icon={CalendarIcon}
//                 />

//                 <StatCard
//                     title="Occupied"
//                     value={statistics.occupied}
//                     icon={Users}
//                 />

//                 <StatCard
//                     title="Maintenance"
//                     value={statistics.maintenance}
//                     icon={Loader2}
//                 />

//                 <StatCard
//                     title="Inactive"
//                     value={statistics.inactive}
//                     icon={X}
//                 />

//             </section>


//             {/* =========================================================
//                 Toolbar
//             ========================================================= */}

//             <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

//                 <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

//                     {/* Search */}

//                     <div className="relative flex-1">

//                         <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                         <input
//                             type="search"
//                             value={search}
//                             onChange={(event) =>
//                                 setSearch(
//                                     event.target.value
//                                 )
//                             }
//                             placeholder="Search table, location, or floor..."
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-200
//                                 bg-slate-50
//                                 py-2.5
//                                 pl-10
//                                 pr-4
//                                 text-sm
//                                 text-slate-900
//                                 outline-none
//                                 transition
//                                 placeholder:text-slate-400
//                                 focus:border-blue-500
//                                 focus:bg-white
//                                 focus:ring-2
//                                 focus:ring-blue-100
//                             "
//                         />

//                     </div>


//                     {/* Filter Button */}

//                     <button
//                         type="button"
//                         onClick={() =>
//                             setShowFilters(
//                                 (value) =>
//                                     !value
//                             )
//                         }
//                         className="
//                             inline-flex
//                             items-center
//                             justify-center
//                             gap-2
//                             rounded-xl
//                             border
//                             border-slate-200
//                             bg-white
//                             px-4
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-slate-700
//                             hover:bg-slate-50
//                         "
//                     >

//                         <Filter className="h-4 w-4" />

//                         Filters

//                         {hasFilters && (
//                             <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
//                                 !
//                             </span>
//                         )}

//                     </button>

//                 </div>


//                 {/* =====================================================
//                     Filters
//                 ===================================================== */}

//                 {showFilters && (

//                     <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">

//                         <FilterSelect
//                             label="Status"
//                             value={
//                                 statusFilter
//                             }
//                             onChange={
//                                 setStatusFilter
//                             }
//                             options={[
//                                 {
//                                     value: "all",
//                                     label: "All statuses",
//                                 },
//                                 ...TABLE_STATUSES.map(
//                                     (status) => ({
//                                         value:
//                                             status,
//                                         label:
//                                             formatStatus(
//                                                 status
//                                             ),
//                                     })
//                                 ),
//                             ]}
//                         />


//                         <FilterSelect
//                             label="Location"
//                             value={
//                                 locationFilter
//                             }
//                             onChange={
//                                 setLocationFilter
//                             }
//                             options={[
//                                 {
//                                     value: "all",
//                                     label: "All locations",
//                                 },
//                                 ...locations.map(
//                                     (location) => ({
//                                         value:
//                                             location,
//                                         label:
//                                             location,
//                                     })
//                                 ),
//                             ]}
//                         />


//                         <FilterSelect
//                             label="Floor"
//                             value={
//                                 floorFilter
//                             }
//                             onChange={
//                                 setFloorFilter
//                             }
//                             options={[
//                                 {
//                                     value: "all",
//                                     label: "All floors",
//                                 },
//                                 ...floors.map(
//                                     (floor) => ({
//                                         value:
//                                             floor,
//                                         label:
//                                             `Floor ${floor}`,
//                                     })
//                                 ),
//                             ]}
//                         />

//                     </div>

//                 )}


//                 {hasFilters && (

//                     <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

//                         <p className="text-xs text-slate-500">

//                             Showing{" "}
//                             <span className="font-semibold text-slate-700">
//                                 {filteredTables.length}
//                             </span>{" "}
//                             of{" "}
//                             <span className="font-semibold text-slate-700">
//                                 {tables.length}
//                             </span>{" "}
//                             tables

//                         </p>


//                         <button
//                             type="button"
//                             onClick={
//                                 clearFilters
//                             }
//                             className="text-xs font-semibold text-blue-600 hover:text-blue-700"
//                         >
//                             Clear filters
//                         </button>

//                     </div>

//                 )}

//             </section>


//             {/* =========================================================
//                 Table List
//             ========================================================= */}

//             <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//                 {/* Desktop Header */}

//                 <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_80px] lg:items-center lg:gap-4">

//                     <span>
//                         Table
//                     </span>

//                     <span>
//                         Capacity
//                     </span>

//                     <span>
//                         Location
//                     </span>

//                     <span>
//                         Status
//                     </span>

//                     <span>
//                         Activity
//                     </span>

//                     <span>
//                         Actions
//                     </span>

//                 </div>


//                 {/* Loading */}

//                 {loading &&
//                 tables.length === 0 ? (

//                     <LoadingState />

//                 ) : filteredTables.length === 0 ? (

//                     <EmptyTableState
//                         hasFilters={
//                             hasFilters
//                         }
//                         onCreate={
//                             handleCreate
//                         }
//                         onClear={
//                             clearFilters
//                         }
//                     />

//                 ) : (

//                     <div className="divide-y divide-slate-100">

//                         {filteredTables.map(
//                             (table) => (

//                                 <TableRow
//                                     key={
//                                         table?._id ||
//                                         table?.id
//                                     }
//                                     table={
//                                         table
//                                     }
//                                     openMenuId={
//                                         openMenuId
//                                     }
//                                     setOpenMenuId={
//                                         setOpenMenuId
//                                     }
//                                     onEdit={
//                                         handleEdit
//                                     }
//                                     onDelete={
//                                         handleDelete
//                                     }
//                                     onStatusChange={
//                                         handleStatusChange
//                                     }
//                                     deletingId={
//                                         deletingId
//                                     }
//                                     statusUpdatingId={
//                                         statusUpdatingId
//                                     }
//                                 />

//                             )
//                         )}

//                     </div>

//                 )}

//             </section>


//             {/* =========================================================
//                 Modal
//             ========================================================= */}

//             {showModal && (

//                 <TableModal
//                     editingTable={
//                         editingTable
//                     }
//                     form={form}
//                     onChange={
//                         handleChange
//                     }
//                     onSubmit={
//                         handleSubmit
//                     }
//                     onClose={
//                         handleCloseModal
//                     }
//                     submitting={
//                         submitting
//                     }
//                 />

//             )}

//         </div>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Stat Card
// |--------------------------------------------------------------------------
// */

// const StatCard = ({
//     title,
//     value,
//     icon: Icon,
// }) => {

//     return (
//         <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

//             <div className="flex items-center justify-between">

//                 <div>

//                     <p className="text-xs font-medium text-slate-500">
//                         {title}
//                     </p>

//                     <p className="mt-2 text-2xl font-bold text-slate-950">
//                         {value}
//                     </p>

//                 </div>

//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

//                     <Icon className="h-5 w-5" />

//                 </div>

//             </div>

//         </article>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Calendar Icon
// |--------------------------------------------------------------------------
// */

// const CalendarIcon = CalendarCheck;


// /*
// |--------------------------------------------------------------------------
// | Filter Select
// |--------------------------------------------------------------------------
// */

// const FilterSelect = ({
//     label,
//     value,
//     onChange,
//     options,
// }) => {

//     return (
//         <label className="block">

//             <span className="mb-1.5 block text-xs font-semibold text-slate-600">
//                 {label}
//             </span>

//             <div className="relative">

//                 <select
//                     value={value}
//                     onChange={(event) =>
//                         onChange(
//                             event.target.value
//                         )
//                     }
//                     className="
//                         w-full
//                         appearance-none
//                         rounded-xl
//                         border
//                         border-slate-200
//                         bg-white
//                         px-3
//                         py-2.5
//                         pr-9
//                         text-sm
//                         text-slate-700
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                     "
//                 >

//                     {options.map(
//                         (option) => (

//                             <option
//                                 key={
//                                     String(
//                                         option.value
//                                     )
//                                 }
//                                 value={
//                                     option.value
//                                 }
//                             >
//                                 {
//                                     option.label
//                                 }
//                             </option>

//                         )
//                     )}

//                 </select>

//                 <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//             </div>

//         </label>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Table Row
// |--------------------------------------------------------------------------
// */

// const TableRow = ({
//     table,
//     openMenuId,
//     setOpenMenuId,
//     onEdit,
//     onDelete,
//     onStatusChange,
//     deletingId,
//     statusUpdatingId,
// }) => {

//     const tableId =
//         table?._id ||
//         table?.id;

//     const menuOpen =
//         openMenuId === tableId;

//     const isDeleting =
//         deletingId === tableId;

//     const isUpdatingStatus =
//         statusUpdatingId === tableId;


//     return (
//         <div className="relative px-5 py-4">

//             {/* Desktop */}

//             <div className="hidden lg:grid lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_80px] lg:items-center lg:gap-4">

//                 <TableIdentity
//                     table={table}
//                 />

//                 <Capacity
//                     value={
//                         table?.capacity
//                     }
//                 />

//                 <div className="text-sm text-slate-600">
//                     {table?.location ||
//                         "—"}

//                     {table?.floor !==
//                         undefined &&
//                         table?.floor !==
//                             null &&
//                         table?.floor !==
//                             "" && (
//                             <span className="ml-1 text-xs text-slate-400">
//                                 · Floor{" "}
//                                 {
//                                     table.floor
//                                 }
//                             </span>
//                         )}
//                 </div>

//                 <StatusBadge
//                     status={
//                         table?.status
//                     }
//                 />

//                 <ActiveBadge
//                     isActive={
//                         table?.isActive !==
//                         false
//                     }
//                 />

//                 <TableActions
//                     table={table}
//                     menuOpen={
//                         menuOpen
//                     }
//                     setMenuOpen={
//                         setOpenMenuId
//                     }
//                     onEdit={onEdit}
//                     onDelete={
//                         onDelete
//                     }
//                     onStatusChange={
//                         onStatusChange
//                     }
//                     isDeleting={
//                         isDeleting
//                     }
//                     isUpdatingStatus={
//                         isUpdatingStatus
//                     }
//                 />

//             </div>


//             {/* Mobile */}

//             <div className="lg:hidden">

//                 <div className="flex items-start gap-3">

//                     <TableIdentity
//                         table={table}
//                     />

//                     <TableActions
//                         table={table}
//                         menuOpen={
//                             menuOpen
//                         }
//                         setMenuOpen={
//                             setOpenMenuId
//                         }
//                         onEdit={
//                             onEdit
//                         }
//                         onDelete={
//                             onDelete
//                         }
//                         onStatusChange={
//                             onStatusChange
//                         }
//                         isDeleting={
//                             isDeleting
//                         }
//                         isUpdatingStatus={
//                             isUpdatingStatus
//                         }
//                     />

//                 </div>


//                 <div className="mt-4 grid grid-cols-2 gap-3">

//                     <InfoItem
//                         label="Capacity"
//                         value={
//                             `${table?.capacity || 0} guests`
//                         }
//                     />

//                     <InfoItem
//                         label="Location"
//                         value={
//                             table?.location ||
//                             "—"
//                         }
//                     />

//                     <InfoItem
//                         label="Status"
//                         value={
//                             <StatusBadge
//                                 status={
//                                     table?.status
//                                 }
//                             />
//                         }
//                     />

//                     <InfoItem
//                         label="Activity"
//                         value={
//                             <ActiveBadge
//                                 isActive={
//                                     table?.isActive !==
//                                     false
//                                 }
//                             />
//                         }
//                     />

//                 </div>

//             </div>

//         </div>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Table Identity
// |--------------------------------------------------------------------------
// */

// const TableIdentity = ({
//     table,
// }) => {

//     return (
//         <div className="flex min-w-0 items-center gap-3">

//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

//                 <Table2 className="h-5 w-5" />

//             </div>

//             <div className="min-w-0">

//                 <p className="truncate text-sm font-semibold text-slate-900">
//                     {table?.tableName ||
//                         "Unnamed Table"}
//                 </p>

//                 <div className="mt-1 flex flex-wrap items-center gap-2">

//                     {table?.isMergeable && (
//                         <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
//                             Mergeable
//                         </span>
//                     )}

//                     {table?.isActive ===
//                         false && (
//                         <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
//                             Inactive
//                         </span>
//                     )}

//                 </div>

//             </div>

//         </div>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Capacity
// |--------------------------------------------------------------------------
// */

// const Capacity = ({
//     value,
// }) => {

//     return (
//         <div className="flex items-center gap-2 text-sm text-slate-600">

//             <Users className="h-4 w-4 text-slate-400" />

//             {value || 0}

//             <span className="text-xs text-slate-400">
//                 guests
//             </span>

//         </div>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Info Item
// |--------------------------------------------------------------------------
// */

// const InfoItem = ({
//     label,
//     value,
// }) => {

//     return (
//         <div className="rounded-xl bg-slate-50 p-3">

//             <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
//                 {label}
//             </p>

//             <div className="mt-1 text-sm font-medium text-slate-700">
//                 {value}
//             </div>

//         </div>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Status Badge
// |--------------------------------------------------------------------------
// */

// const StatusBadge = ({
//     status,
// }) => {

//     const normalized =
//         status?.toLowerCase();


//     const styles = {
//         available:
//             "bg-emerald-50 text-emerald-700",

//         reserved:
//             "bg-blue-50 text-blue-700",

//         occupied:
//             "bg-amber-50 text-amber-700",

//         maintenance:
//             "bg-red-50 text-red-700",
//     };


//     return (
//         <span
//             className={`
//                 inline-flex
//                 items-center
//                 rounded-full
//                 px-2.5
//                 py-1
//                 text-[11px]
//                 font-semibold
//                 capitalize
//                 ${
//                     styles[
//                         normalized
//                     ] ||
//                     "bg-slate-100 text-slate-600"
//                 }
//             `}
//         >
//             {formatStatus(
//                 status
//             )}
//         </span>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Active Badge
// |--------------------------------------------------------------------------
// */

// const ActiveBadge = ({
//     isActive,
// }) => {

//     return (
//         <span
//             className={`
//                 inline-flex
//                 rounded-full
//                 px-2.5
//                 py-1
//                 text-[11px]
//                 font-semibold
//                 ${
//                     isActive
//                         ? "bg-emerald-50 text-emerald-700"
//                         : "bg-slate-100 text-slate-500"
//                 }
//             `}
//         >
//             {isActive
//                 ? "Active"
//                 : "Inactive"}
//         </span>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Table Actions
// |--------------------------------------------------------------------------
// */

// const TableActions = ({
//     table,
//     menuOpen,
//     setMenuOpen,
//     onEdit,
//     onDelete,
//     onStatusChange,
//     isDeleting,
//     isUpdatingStatus,
// }) => {

//     const tableId =
//         table?._id ||
//         table?.id;


//     return (
//         <div className="relative flex justify-end">

//             <button
//                 type="button"
//                 onClick={() =>
//                     setMenuOpen(
//                         menuOpen
//                             ? null
//                             : tableId
//                     )
//                 }
//                 className="
//                     rounded-lg
//                     p-2
//                     text-slate-400
//                     transition
//                     hover:bg-slate-100
//                     hover:text-slate-700
//                 "
//                 aria-label="Table actions"
//             >

//                 <MoreHorizontal className="h-5 w-5" />

//             </button>


//             {menuOpen && (

//                 <div className="absolute right-0 top-10 z-30 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">

//                     {/* Edit */}

//                     <button
//                         type="button"
//                         onClick={() =>
//                             onEdit(table)
//                         }
//                         className="
//                             flex
//                             w-full
//                             items-center
//                             gap-3
//                             px-3
//                             py-2.5
//                             text-left
//                             text-sm
//                             text-slate-700
//                             hover:bg-slate-50
//                         "
//                     >

//                         <Edit3 className="h-4 w-4" />

//                         Edit table

//                     </button>


//                     {/* Status Section */}

//                     <div className="border-t border-slate-100 px-3 py-2">

//                         <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
//                             Change status
//                         </p>


//                         {[
//                             "available",
//                             "reserved",
//                             "occupied",
//                             "maintenance",
//                         ].map(
//                             (status) => (

//                                 <button
//                                     key={
//                                         status
//                                     }
//                                     type="button"
//                                     disabled={
//                                         isUpdatingStatus ||
//                                         table?.status ===
//                                             status
//                                     }
//                                     onClick={() =>
//                                         onStatusChange(
//                                             table,
//                                             status
//                                         )
//                                     }
//                                     className="
//                                         flex
//                                         w-full
//                                         items-center
//                                         justify-between
//                                         rounded-lg
//                                         px-2
//                                         py-1.5
//                                         text-left
//                                         text-xs
//                                         text-slate-600
//                                         hover:bg-slate-50
//                                         disabled:cursor-not-allowed
//                                         disabled:opacity-40
//                                     "
//                                 >

//                                     <span>
//                                         {formatStatus(
//                                             status
//                                         )}
//                                     </span>

//                                     {table?.status ===
//                                         status && (
//                                         <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
//                                     )}

//                                 </button>

//                             )
//                         )}

//                     </div>


//                     {/* Delete */}

//                     <div className="border-t border-slate-100">

//                         <button
//                             type="button"
//                             disabled={
//                                 isDeleting
//                             }
//                             onClick={() =>
//                                 onDelete(
//                                     table
//                                 )
//                             }
//                             className="
//                                 flex
//                                 w-full
//                                 items-center
//                                 gap-3
//                                 px-3
//                                 py-2.5
//                                 text-left
//                                 text-sm
//                                 text-red-600
//                                 hover:bg-red-50
//                                 disabled:opacity-50
//                             "
//                         >

//                             {isDeleting ? (
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                             ) : (
//                                 <Trash2 className="h-4 w-4" />
//                             )}

//                             Delete table

//                         </button>

//                     </div>

//                 </div>

//             )}

//         </div>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Loading State
// |--------------------------------------------------------------------------
// */

// const LoadingState = () => {

//     return (
//         <div className="flex min-h-72 flex-col items-center justify-center p-8">

//             <Loader2 className="h-7 w-7 animate-spin text-blue-600" />

//             <p className="mt-3 text-sm font-medium text-slate-700">
//                 Loading tables...
//             </p>

//             <p className="mt-1 text-xs text-slate-400">
//                 Getting the latest table information.
//             </p>

//         </div>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Empty State
// |--------------------------------------------------------------------------
// */

// const EmptyTableState = ({
//     hasFilters,
//     onCreate,
//     onClear,
// }) => {

//     return (
//         <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">

//             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

//                 <Table2 className="h-6 w-6" />

//             </div>


//             <h3 className="mt-4 text-sm font-semibold text-slate-900">

//                 {hasFilters
//                     ? "No matching tables"
//                     : "No tables yet"}

//             </h3>


//             <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">

//                 {hasFilters
//                     ? "Try changing your search or filters."
//                     : "Create your first restaurant table to start managing availability."}

//             </p>


//             <div className="mt-4 flex items-center gap-3">

//                 {hasFilters ? (

//                     <button
//                         type="button"
//                         onClick={
//                             onClear
//                         }
//                         className="text-sm font-semibold text-blue-600 hover:text-blue-700"
//                     >
//                         Clear filters
//                     </button>

//                 ) : (

//                     <button
//                         type="button"
//                         onClick={
//                             onCreate
//                         }
//                         className="
//                             inline-flex
//                             items-center
//                             gap-2
//                             rounded-xl
//                             bg-blue-600
//                             px-4
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-white
//                             hover:bg-blue-700
//                         "
//                     >

//                         <Plus className="h-4 w-4" />

//                         Add Table

//                     </button>

//                 )}

//             </div>

//         </div>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Table Modal
// |--------------------------------------------------------------------------
// */

// const TableModal = ({
//     editingTable,
//     form,
//     onChange,
//     onSubmit,
//     onClose,
//     submitting,
// }) => {

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">

//             <div
//                 className="absolute inset-0"
//                 onClick={onClose}
//             />


//             <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

//                 {/* Header */}

//                 <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">

//                     <div>

//                         <h2 className="text-lg font-bold text-slate-950">

//                             {editingTable
//                                 ? "Edit Table"
//                                 : "Create Table"}

//                         </h2>

//                         <p className="mt-1 text-xs text-slate-500">

//                             {editingTable
//                                 ? "Update the restaurant table information."
//                                 : "Add a new table to your restaurant."}

//                         </p>

//                     </div>


//                     <button
//                         type="button"
//                         onClick={
//                             onClose
//                         }
//                         disabled={
//                             submitting
//                         }
//                         className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
//                     >

//                         <X className="h-5 w-5" />

//                     </button>

//                 </div>


//                 {/* Form */}

//                 <form
//                     onSubmit={
//                         onSubmit
//                     }
//                 >

//                     <div className="space-y-5 p-5 sm:p-6">

//                         {/* Table Name */}

//                         <FormField
//                             label="Table Name"
//                             required
//                         >

//                             <input
//                                 name="tableName"
//                                 value={
//                                     form.tableName
//                                 }
//                                 onChange={
//                                     onChange
//                                 }
//                                 placeholder="Table 1"
//                                 required
//                                 className="form-input"
//                             />

//                         </FormField>


//                         {/* Capacity */}

//                         <FormField
//                             label="Capacity"
//                             required
//                         >

//                             <input
//                                 type="number"
//                                 name="capacity"
//                                 value={
//                                     form.capacity
//                                 }
//                                 onChange={
//                                     onChange
//                                 }
//                                 min="1"
//                                 max="100"
//                                 placeholder="4"
//                                 required
//                                 className="form-input"
//                             />

//                         </FormField>


//                         {/* Location / Floor */}

//                         <div className="grid gap-5 sm:grid-cols-2">

//                             <FormField
//                                 label="Location"
//                             >

//                                 <input
//                                     name="location"
//                                     value={
//                                         form.location
//                                     }
//                                     onChange={
//                                         onChange
//                                     }
//                                     placeholder="Main Hall"
//                                     className="form-input"
//                                 />

//                             </FormField>


//                             <FormField
//                                 label="Floor"
//                             >

//                                 <input
//                                     name="floor"
//                                     value={
//                                         form.floor
//                                     }
//                                     onChange={
//                                         onChange
//                                     }
//                                     placeholder="1"
//                                     className="form-input"
//                                 />

//                             </FormField>

//                         </div>


//                         {/* Status */}

//                         <FormField
//                             label="Status"
//                         >

//                             <div className="relative">

//                                 <select
//                                     name="status"
//                                     value={
//                                         form.status
//                                     }
//                                     onChange={
//                                         onChange
//                                     }
//                                     className="form-input appearance-none pr-9"
//                                 >

//                                     {TABLE_STATUSES.map(
//                                         (
//                                             status
//                                         ) => (

//                                             <option
//                                                 key={
//                                                     status
//                                                 }
//                                                 value={
//                                                     status
//                                                 }
//                                             >
//                                                 {formatStatus(
//                                                     status
//                                                 )}
//                                             </option>

//                                         )
//                                     )}

//                                 </select>

//                                 <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                             </div>

//                         </FormField>


//                         {/* Options */}

//                         <div className="grid gap-3 sm:grid-cols-2">

//                             <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">

//                                 <input
//                                     type="checkbox"
//                                     name="isActive"
//                                     checked={
//                                         form.isActive
//                                     }
//                                     onChange={
//                                         onChange
//                                     }
//                                     className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                                 />

//                                 <div>

//                                     <p className="text-sm font-semibold text-slate-800">
//                                         Active table
//                                     </p>

//                                     <p className="text-xs text-slate-500">
//                                         Table can be used for reservations.
//                                     </p>

//                                 </div>

//                             </label>


//                             <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">

//                                 <input
//                                     type="checkbox"
//                                     name="isMergeable"
//                                     checked={
//                                         form.isMergeable
//                                     }
//                                     onChange={
//                                         onChange
//                                     }
//                                     className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                                 />

//                                 <div>

//                                     <p className="text-sm font-semibold text-slate-800">
//                                         Mergeable
//                                     </p>

//                                     <p className="text-xs text-slate-500">
//                                         Can be combined with another table.
//                                     </p>

//                                 </div>

//                             </label>

//                         </div>


//                         {/* Notes */}

//                         <FormField
//                             label="Notes"
//                         >

//                             <textarea
//                                 name="notes"
//                                 value={
//                                     form.notes
//                                 }
//                                 onChange={
//                                     onChange
//                                 }
//                                 rows="3"
//                                 placeholder="Optional table notes..."
//                                 className="form-input resize-none"
//                             />

//                         </FormField>

//                     </div>


//                     {/* Footer */}

//                     <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

//                         <button
//                             type="button"
//                             onClick={
//                                 onClose
//                             }
//                             disabled={
//                                 submitting
//                             }
//                             className="
//                                 rounded-xl
//                                 border
//                                 border-slate-200
//                                 bg-white
//                                 px-4
//                                 py-2.5
//                                 text-sm
//                                 font-semibold
//                                 text-slate-700
//                                 hover:bg-slate-50
//                             "
//                         >
//                             Cancel
//                         </button>


//                         <button
//                             type="submit"
//                             disabled={
//                                 submitting
//                             }
//                             className="
//                                 inline-flex
//                                 items-center
//                                 justify-center
//                                 gap-2
//                                 rounded-xl
//                                 bg-blue-600
//                                 px-4
//                                 py-2.5
//                                 text-sm
//                                 font-semibold
//                                 text-white
//                                 hover:bg-blue-700
//                                 disabled:cursor-not-allowed
//                                 disabled:opacity-60
//                             "
//                         >

//                             {submitting && (
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                             )}

//                             {editingTable
//                                 ? "Save Changes"
//                                 : "Create Table"}

//                         </button>

//                     </div>

//                 </form>

//             </div>

//         </div>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Form Field
// |--------------------------------------------------------------------------
// */

// const FormField = ({
//     label,
//     required,
//     children,
// }) => {

//     return (
//         <label className="block">

//             <span className="mb-1.5 block text-sm font-semibold text-slate-700">

//                 {label}

//                 {required && (
//                     <span className="ml-1 text-red-500">
//                         *
//                     </span>
//                 )}

//             </span>

//             {children}

//         </label>
//     );
// };


// /*
// |--------------------------------------------------------------------------
// | Helpers
// |--------------------------------------------------------------------------
// */

// const formatStatus = (
//     status
// ) => {

//     if (!status) {
//         return "Unknown";
//     }

//     return String(status)
//         .replaceAll(
//             "_",
//             " "
//         )
//         .replace(
//             /\b\w/g,
//             (character) =>
//                 character.toUpperCase()
//         );
// };


// /*
// |--------------------------------------------------------------------------
// | Export
// |--------------------------------------------------------------------------
// */

// export default Tables;