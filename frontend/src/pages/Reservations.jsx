

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
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Filter,
    Loader2,
    MoreHorizontal,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Users,
    XCircle,
} from "lucide-react";


import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Badge from "../components/ui/Badge.jsx";
import Modal from "../components/ui/Modal.jsx";
import Toast from "../components/ui/Toast.jsx";
import Table from "../components/ui/Table.jsx";
import Pagination from "../components/ui/Pagination.jsx";


import {
    fetchBookings,
    fetchBooking,
    createDashboardBooking,
    updateDashboardBooking,
    cancelDashboardBooking,
    checkBookingAvailability,
    setBookingFilters,
    clearBookingFilters,
    setBookingPage,
    setSelectedBooking,
    clearSelectedBooking,
    clearAvailability,
    clearBookingErrors,
    selectBookings,
    selectSelectedBooking,
    selectBookingPagination,
    selectBookingFilters,
    selectBookingLoading,
    selectBookingCreating,
    selectBookingUpdating,
    selectBookingCancelling,
    selectBookingError,
    selectBookingCreateError,
    selectBookingUpdateError,
    selectBookingCancelError,
    selectBookingAvailability,
    selectBookingAvailabilityLoading,
} from "../features/bookingSlice.js";


/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const STATUS_OPTIONS = [
    {
        value: "",
        label: "All statuses",
    },
    {
        value: "pending",
        label: "Pending",
    },
    {
        value: "confirmed",
        label: "Confirmed",
    },
    {
        value: "seated",
        label: "Seated",
    },
    {
        value: "completed",
        label: "Completed",
    },
    {
        value: "cancelled",
        label: "Cancelled",
    },
    {
        value: "no_show",
        label: "No show",
    },
];


const SOURCE_OPTIONS = [
    {
        value: "",
        label: "All sources",
    },
    {
        value: "dashboard",
        label: "Dashboard",
    },
    {
        value: "website",
        label: "Website",
    },
    {
        value: "ai_voice",
        label: "AI Voice",
    },
    {
        value: "whatsapp",
        label: "WhatsApp",
    },
    {
        value: "walk_in",
        label: "Walk-in",
    },
];


const PAYMENT_OPTIONS = [
    {
        value: "",
        label: "All payments",
    },
    {
        value: "pending",
        label: "Pending",
    },
    {
        value: "paid",
        label: "Paid",
    },
    {
        value: "refunded",
        label: "Refunded",
    },
    {
        value: "not_required",
        label: "Not required",
    },
];


const DEFAULT_FORM = {
    name: "",
    phone: "",
    email: "",
    bookingDate: "",
    startTime: "",
    guestCount: 2,
    specialRequest: "",
    occasion: "",
    notes: "",
};


const STATUS_BADGE_MAP = {
    pending: "warning",
    confirmed: "success",
    seated: "info",
    completed: "success",
    cancelled: "danger",
    no_show: "danger",
};


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

    return value
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
};


const formatDate = (
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
        return value;
    }


    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(date);
};


const formatTime = (
    value
) => {

    if (!value) {
        return "—";
    }


    /*
    |----------------------------------------------------------------------
    | Backend already returns HH:mm in most cases.
    | Keep that value intact.
    |----------------------------------------------------------------------
    */

    return value;
};


const getCustomerName = (
    booking
) => {

    return (
        booking?.name ||
        booking?.customer?.fullName ||
        "Unknown customer"
    );
};


const getCustomerPhone = (
    booking
) => {

    return (
        booking?.phone ||
        booking?.customer?.phone ||
        ""
    );
};


const getBookingId = (
    booking
) => {

    return (
        booking?._id ||
        booking?.id
    );
};


/*
|--------------------------------------------------------------------------
| Reservations Page
|--------------------------------------------------------------------------
*/

const Reservations = () => {


    const dispatch =
        useDispatch();


    /*
    |--------------------------------------------------------------------------
    | Redux State
    |--------------------------------------------------------------------------
    */

    const bookings =
        useSelector(
            selectBookings
        );

    const selectedBooking =
        useSelector(
            selectSelectedBooking
        );

    const pagination =
        useSelector(
            selectBookingPagination
        );

    const filters =
        useSelector(
            selectBookingFilters
        );

    const loading =
        useSelector(
            selectBookingLoading
        );

    const creating =
        useSelector(
            selectBookingCreating
        );

    const updating =
        useSelector(
            selectBookingUpdating
        );

    const cancelling =
        useSelector(
            selectBookingCancelling
        );

    const bookingError =
        useSelector(
            selectBookingError
        );

    const createError =
        useSelector(
            selectBookingCreateError
        );

    const updateError =
        useSelector(
            selectBookingUpdateError
        );

    const cancelError =
        useSelector(
            selectBookingCancelError
        );

    const availability =
        useSelector(
            selectBookingAvailability
        );

    const availabilityLoading =
        useSelector(
            selectBookingAvailabilityLoading
        );

    const [selectedBookingId, setSelectedBookingId] = useState(null);


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
        showFilters,
        setShowFilters,
    ] = useState(false);


    const [
        formOpen,
        setFormOpen,
    ] = useState(false);


    const [
        formMode,
        setFormMode,
    ] = useState("create");


    const [
        form,
        setForm,
    ] = useState(
        DEFAULT_FORM
    );


    const [
        formErrors,
        setFormErrors,
    ] = useState({});


    const [
        detailsOpen,
        setDetailsOpen,
    ] = useState(false);


    const [
        cancelOpen,
        setCancelOpen,
    ] = useState(false);


    const [
        cancelReason,
        setCancelReason,
    ] = useState("");


    const [
        toast,
        setToast,
    ] = useState(null);


    const [
        actionBookingId,
        setActionBookingId,
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Fetch Bookings
    |--------------------------------------------------------------------------
    */

    const loadBookings =
        useCallback(() => {

            dispatch(
                fetchBookings({
                    ...filters,

                    page:
                        pagination.page,

                    limit:
                        pagination.limit,
                })
            );

        }, [
            dispatch,
            filters,
            pagination.page,
            pagination.limit,
        ]);


    useEffect(() => {

        loadBookings();

    }, [
        loadBookings,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Error → Toast
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const error =
            createError ||
            updateError ||
            cancelError;


        if (!error) {
            return;
        }


        setToast({
            type: "error",
            title: "Action failed",
            message: error,
        });

    }, [
        createError,
        updateError,
        cancelError,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const filteredBookings =
        useMemo(() => {

            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();


            if (!normalizedSearch) {
                return bookings;
            }


            return bookings.filter(
                (booking) => {

                    const values = [
                        getCustomerName(
                            booking
                        ),

                        getCustomerPhone(
                            booking
                        ),

                        booking?.email,

                        booking?.status,

                        booking?.bookingSource,

                        booking?.occasion,

                        booking?.bookingDate,

                        booking?.startTime,
                    ];


                    return values.some(
                        (value) =>
                            String(
                                value || ""
                            )
                                .toLowerCase()
                                .includes(
                                    normalizedSearch
                                )
                    );
                }
            );

        }, [
            bookings,
            search,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Filter Change
    |--------------------------------------------------------------------------
    */

    const handleFilterChange = (
        name,
        value
    ) => {

        dispatch(
            setBookingFilters({
                [name]: value,
            })
        );

        dispatch(
            setBookingPage(1)
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */

    const handleClearFilters =
        () => {

            setSearch("");

            dispatch(
                clearBookingFilters()
            );

            dispatch(
                setBookingPage(1)
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Open Create Form
    |--------------------------------------------------------------------------
    */

    const openCreateForm =
        () => {

            dispatch(
                clearBookingErrors()
            );

            dispatch(
                clearAvailability()
            );

            setForm(
                DEFAULT_FORM
            );

            setFormErrors({});

            setFormMode("create");

            setFormOpen(true);
        };


    /*
    |--------------------------------------------------------------------------
    | Open Edit Form
    |--------------------------------------------------------------------------
    */

    // const openEditForm =

    //     (booking) => {
    //         console.log("EDIT BOOKING:", booking);
    //         console.log("BOOKING ID:", getBookingId(booking));
    //         dispatch(
    //             clearBookingErrors()
    //         );

    //         dispatch(
    //             clearAvailability()
    //         );


    //         setForm({
    //             name:
    //                 getCustomerName(
    //                     booking
    //                 ),

    //             phone:
    //                 getCustomerPhone(
    //                     booking
    //                 ),

    //             email:
    //                 booking?.email ||
    //                 booking?.customer?.email ||
    //                 "",

    //             bookingDate:
    //                 booking?.bookingDate ||
    //                 "",

    //             startTime:
    //                 booking?.startTime ||
    //                 "",

    //             guestCount:
    //                 booking?.guestCount ||
    //                 2,

    //             specialRequest:
    //                 booking?.specialRequest ||
    //                 "",

    //             occasion:
    //                 booking?.occasion ||
    //                 "",

    //             notes:
    //                 booking?.notes ||
    //                 "",
    //         });


    //         setSelectedBooking(
    //             booking
    //         );


    //         setFormErrors({});

    //         setFormMode("edit");

    //         setFormOpen(true);

    //         console.log("SELECTED BOOKING:", selectedBooking);
    //         console.log(
    //             "BOOKING ID:",
    //             getBookingId(selectedBooking)
    //         );
    //     };

    const openEditForm = (booking) => {
        dispatch(clearBookingErrors());
        dispatch(clearAvailability());

        const bookingId = getBookingId(booking);
        // const bookingId = setSelectedBookingId(booking._id);
        console.log(bookingId, "test booking id here ")
        if (!bookingId) {
            setToast({
                type: "error",
                title: "Unable to edit reservation",
                message: "Booking ID is missing.",
            });

            return;
        }

        setForm({
            name: getCustomerName(booking),
            phone: getCustomerPhone(booking),
            email:
                booking?.email ||
                booking?.customer?.email ||
                "",

            bookingDate:
                booking?.bookingDate
                    ? booking.bookingDate.slice(0, 10)
                    : "",

            startTime:
                booking?.startTime || "",

            guestCount:
                booking?.guestCount || 2,

            specialRequest:
                booking?.specialRequest || "",

            occasion:
                booking?.occasion || "",

            notes:
                booking?.notes || "",
        });

        setSelectedBooking(booking);
        setSelectedBookingId(bookingId);

        setFormErrors({});
        setFormMode("edit");
        setFormOpen(true);
    };


    /*
    |--------------------------------------------------------------------------
    | Open Details
    |--------------------------------------------------------------------------
    */

    const openDetails =
        async (booking) => {

            const bookingId =
                getBookingId(
                    booking
                );


            if (!bookingId) {
                return;
            }


            setActionBookingId(
                bookingId
            );


            const result =
                await dispatch(
                    fetchBooking(
                        bookingId
                    )
                );


            setActionBookingId(
                null
            );


            if (
                fetchBooking.fulfilled.match(
                    result
                )
            ) {

                setDetailsOpen(
                    true
                );

            } else {

                setToast({
                    type: "error",
                    title: "Unable to load reservation",
                    message:
                        result.payload ||
                        "Reservation details could not be loaded.",
                });
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Form Change
    |--------------------------------------------------------------------------
    */

    const handleFormChange =
        (event) => {

            const {
                name,
                value,
            } = event.target;


            setForm(
                (current) => ({
                    ...current,
                    [name]:
                        name ===
                            "guestCount"
                            ? value
                            : value,
                })
            );


            setFormErrors(
                (current) => ({
                    ...current,
                    [name]: "",
                })
            );


            if (
                name ===
                "bookingDate" ||
                name ===
                "startTime" ||
                name ===
                "guestCount"
            ) {

                dispatch(
                    clearAvailability()
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Validate Form
    |--------------------------------------------------------------------------
    */

    const validateForm =
        () => {

            const errors = {};


            if (
                !form.name.trim()
            ) {
                errors.name =
                    "Customer name is required.";
            }


            if (
                !form.phone.trim()
            ) {
                errors.phone =
                    "Phone number is required.";
            }


            if (
                !form.bookingDate
            ) {
                errors.bookingDate =
                    "Booking date is required.";
            }


            if (
                !form.startTime
            ) {
                errors.startTime =
                    "Booking time is required.";
            }


            const guests =
                Number(
                    form.guestCount
                );


            if (
                !Number.isInteger(
                    guests
                ) ||
                guests < 1 ||
                guests > 100
            ) {
                errors.guestCount =
                    "Guests must be between 1 and 100.";
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
    | Check Availability
    |--------------------------------------------------------------------------
    */

    const handleCheckAvailability =
        async () => {

            if (
                !form.bookingDate ||
                !form.startTime ||
                !form.guestCount
            ) {

                setToast({
                    type: "warning",
                    title: "Missing booking details",
                    message:
                        "Select a date, time and guest count first.",
                });

                return;
            }


            const result =
                await dispatch(
                    checkBookingAvailability({
                        bookingDate:
                            form.bookingDate,

                        startTime:
                            form.startTime,

                        guestCount:
                            Number(
                                form.guestCount
                            ),

                        excludeBookingId:
                            formMode === "edit"
                                ? getBookingId(
                                    selectedBooking
                                )
                                : undefined,
                    })
                );


            if (
                checkBookingAvailability.fulfilled.match(
                    result
                )
            ) {

                if (
                    result.payload?.available
                ) {

                    setToast({
                        type: "success",
                        title: "Table available",
                        message:
                            result.payload?.table
                                ? `Table ${result.payload.table?.tableNumber || result.payload.table?.name || ""} is available.`
                                : "A suitable table is available.",
                    });

                } else {

                    setToast({
                        type: "warning",
                        title: "No table available",
                        message:
                            result.payload?.reason ||
                            "No suitable table is available.",
                    });
                }
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Submit Form
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const bookingId =
            formMode === "edit"
                ? selectedBookingId
                : null;



        if (
            formMode === "edit" &&
            !bookingId
        ) {
            console.log(selectedBookingId, "testing booking id in handlesubmit")
            setToast({
                type: "error",
                title: "Unable to update reservation",
                message: "Booking ID is missing.",
            });

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Check Availability
        |--------------------------------------------------------------------------
        */

        const availabilityResult = await dispatch(
            checkBookingAvailability({
                bookingDate: form.bookingDate,
                startTime: form.startTime,
                guestCount: Number(form.guestCount),

                excludeBookingId:
                    formMode === "edit"
                        ? bookingId
                        : undefined,
            })
        );

        if (
            !checkBookingAvailability.fulfilled.match(
                availabilityResult
            )
        ) {
            return;
        }

        if (
            !availabilityResult.payload?.available
        ) {
            setToast({
                type: "warning",
                title: "Time slot unavailable",
                message:
                    availabilityResult.payload?.reason ||
                    "No suitable table is available for this booking.",
            });

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Booking Payload
        |--------------------------------------------------------------------------
        */

        const payload = {
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),

            bookingDate: form.bookingDate,
            startTime: form.startTime,

            guestCount: Number(form.guestCount),

            specialRequest:
                form.specialRequest.trim(),

            occasion:
                form.occasion.trim(),

            notes:
                form.notes.trim(),
        };

        /*
        |--------------------------------------------------------------------------
        | Create / Update
        |--------------------------------------------------------------------------
        */

        let result;

        if (formMode === "create") {
            result = await dispatch(
                createDashboardBooking(payload)
            );
        } else {
            result = await dispatch(
                updateDashboardBooking({
                    bookingId: selectedBookingId,
                    updates: payload,
                })
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Create Success
        |--------------------------------------------------------------------------
        */

        if (
            formMode === "create" &&
            createDashboardBooking.fulfilled.match(result)
        ) {
            setFormOpen(false);

            setToast({
                type: "success",
                title: "Reservation created",
                message:
                    result.payload?.message ||
                    "Reservation created successfully.",
            });

            dispatch(
                fetchBookings({
                    ...filters,
                    page: pagination.page,
                    limit: pagination.limit,
                })
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Update Success
        |--------------------------------------------------------------------------
        */

        if (
            formMode === "edit" &&
            updateDashboardBooking.fulfilled.match(result)
        ) {
            setFormOpen(false);

            setSelectedBooking(null);
            setSelectedBookingId(null);

            setToast({
                type: "success",
                title: "Reservation updated",
                message:
                    result.payload?.message ||
                    "Reservation updated successfully.",
            });

            dispatch(
                fetchBookings({
                    ...filters,
                    page: pagination.page,
                    limit: pagination.limit,
                })
            );

            return;
        }
    };

    // const handleSubmit =
    //     async (event) => {

    //         event.preventDefault();


    //         if (
    //             !validateForm()
    //         ) {
    //             return;
    //         }


    //         /*
    //         |--------------------------------------------------------------
    //         | Check availability before create/update.
    //         |--------------------------------------------------------------
    //         */

    //         const availabilityResult =
    //             await dispatch(
    //                 checkBookingAvailability({
    //                     bookingDate:
    //                         form.bookingDate,

    //                     startTime:
    //                         form.startTime,

    //                     guestCount:
    //                         Number(
    //                             form.guestCount
    //                         ),

    //                     excludeBookingId:
    //                         formMode === "edit"
    //                             ? getBookingId(
    //                                 selectedBooking
    //                             )
    //                             : undefined,
    //                 })
    //             );


    //         if (
    //             !checkBookingAvailability.fulfilled.match(
    //                 availabilityResult
    //             )
    //         ) {
    //             return;
    //         }


    //         if (
    //             !availabilityResult.payload?.available
    //         ) {

    //             setToast({
    //                 type: "warning",
    //                 title: "Time slot unavailable",
    //                 message:
    //                     availabilityResult.payload?.reason ||
    //                     "No suitable table is available for this booking.",
    //             });

    //             return;
    //         }


    //         const payload = {
    //             name:
    //                 form.name.trim(),

    //             phone:
    //                 form.phone.trim(),

    //             email:
    //                 form.email.trim(),

    //             bookingDate:
    //                 form.bookingDate,

    //             startTime:
    //                 form.startTime,

    //             guestCount:
    //                 Number(
    //                     form.guestCount
    //                 ),

    //             specialRequest:
    //                 form.specialRequest.trim(),

    //             occasion:
    //                 form.occasion.trim(),

    //             notes:
    //                 form.notes.trim(),
    //         };


    //         let result;


    //         if (
    //             formMode === "create"
    //         ) {

    //             result =
    //                 await dispatch(
    //                     createDashboardBooking(
    //                         payload
    //                     )
    //                 );

    //         } else {

    //             result =
    //                 await dispatch(
    //                     updateDashboardBooking({
    //                         bookingId:
    //                             getBookingId(
    //                                 selectedBooking
    //                             ),

    //                         updates:
    //                             payload,
    //                     })
    //                 );
    //         }


    //         if (
    //             formMode === "create" &&
    //             createDashboardBooking.fulfilled.match(
    //                 result
    //             )
    //         ) {

    //             setFormOpen(
    //                 false
    //             );

    //             setToast({
    //                 type: "success",
    //                 title: "Reservation created",
    //                 message:
    //                     result.payload?.message ||
    //                     "Reservation created successfully.",
    //             });


    //             dispatch(
    //                 fetchBookings({
    //                     ...filters,
    //                     page:
    //                         pagination.page,
    //                     limit:
    //                         pagination.limit,
    //                 })
    //             );


    //             return;
    //         }


    //         if (
    //             formMode === "edit" &&
    //             updateDashboardBooking.fulfilled.match(
    //                 result
    //             )
    //         ) {

    //             setFormOpen(
    //                 false
    //             );

    //             setToast({
    //                 type: "success",
    //                 title: "Reservation updated",
    //                 message:
    //                     result.payload?.message ||
    //                     "Reservation updated successfully.",
    //             });


    //             return;
    //         }

    //     };


    /*
    |--------------------------------------------------------------------------
    | Open Cancel Modal
    |--------------------------------------------------------------------------
    */

    const openCancelModal =
        (booking) => {

            dispatch(
                setSelectedBooking(
                    booking
                )
            );

            setCancelReason("");

            setCancelOpen(
                true
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Cancel Booking
    |--------------------------------------------------------------------------
    */

    const handleCancel =
        async () => {

            const bookingId =
                getBookingId(
                    selectedBooking
                );


            if (!bookingId) {
                return;
            }


            const result =
                await dispatch(
                    cancelDashboardBooking({
                        bookingId,

                        reason:
                            cancelReason.trim() ||
                            "Cancelled by dashboard",

                        cancelledBy:
                            "admin",
                    })
                );


            if (
                cancelDashboardBooking.fulfilled.match(
                    result
                )
            ) {

                setCancelOpen(
                    false
                );

                setToast({
                    type: "success",
                    title: "Reservation cancelled",
                    message:
                        result.payload?.message ||
                        "Reservation cancelled successfully.",
                });

            }

        };


    /*
    |--------------------------------------------------------------------------
    | Status Summary
    |--------------------------------------------------------------------------
    */

    const statusSummary =
        useMemo(() => {

            return {
                total:
                    pagination.total || 0,

                confirmed:
                    bookings.filter(
                        (booking) =>
                            booking?.status ===
                            "confirmed"
                    ).length,

                pending:
                    bookings.filter(
                        (booking) =>
                            booking?.status ===
                            "pending"
                    ).length,

                cancelled:
                    bookings.filter(
                        (booking) =>
                            booking?.status ===
                            "cancelled"
                    ).length,
            };

        }, [
            bookings,
            pagination.total,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Table Columns
    |--------------------------------------------------------------------------
    */

    const columns =
        useMemo(
            () => [

                {
                    key: "customer",
                    header: "Customer",
                    minWidth: "220px",

                    render: (
                        _,
                        booking
                    ) => {

                        const name =
                            getCustomerName(
                                booking
                            );

                        const phone =
                            getCustomerPhone(
                                booking
                            );


                        return (
                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-blue-50
                                        text-sm
                                        font-semibold
                                        text-blue-700
                                    "
                                >
                                    {name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="min-w-0">

                                    <p
                                        className="
                                            truncate
                                            font-semibold
                                            text-slate-900
                                        "
                                    >
                                        {name}
                                    </p>

                                    <p
                                        className="
                                            truncate
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        {phone ||
                                            "No phone"}
                                    </p>

                                </div>

                            </div>
                        );
                    },
                },


                {
                    key: "bookingDate",
                    header: "Date",

                    render: (
                        value
                    ) => (
                        <div className="flex items-center gap-2 whitespace-nowrap">

                            <CalendarDays
                                className="
                                    h-4
                                    w-4
                                    text-slate-400
                                "
                            />

                            <span>
                                {formatDate(
                                    value
                                )}
                            </span>

                        </div>
                    ),
                },


                {
                    key: "startTime",
                    header: "Time",

                    render: (
                        value
                    ) => (
                        <div className="flex items-center gap-2 whitespace-nowrap">

                            <Clock3
                                className="
                                    h-4
                                    w-4
                                    text-slate-400
                                "
                            />

                            <span>
                                {formatTime(
                                    value
                                )}
                            </span>

                        </div>
                    ),
                },


                {
                    key: "guestCount",
                    header: "Guests",

                    render: (
                        value
                    ) => (
                        <div className="flex items-center gap-2">

                            <Users
                                className="
                                    h-4
                                    w-4
                                    text-slate-400
                                "
                            />

                            <span>
                                {value || 0}
                            </span>

                        </div>
                    ),
                },


                {
                    key: "status",
                    header: "Status",

                    render: (
                        value
                    ) => (
                        <Badge
                            variant={
                                STATUS_BADGE_MAP[
                                value
                                ] ||
                                "default"
                            }
                        >
                            {formatStatus(
                                value
                            )}
                        </Badge>
                    ),
                },


                {
                    key: "bookingSource",
                    header: "Source",

                    render: (
                        value
                    ) => (
                        <span
                            className="
                                whitespace-nowrap
                                text-xs
                                font-medium
                                capitalize
                                text-slate-500
                            "
                        >
                            {formatStatus(
                                value
                            )}
                        </span>
                    ),
                },


                {
                    key: "actions",
                    header: "",
                    headerClassName:
                        "text-right",

                    cellClassName:
                        "text-right",

                    render: (
                        _,
                        booking
                    ) => {

                        const bookingId =
                            getBookingId(
                                booking
                            );

                        const isActionLoading =
                            actionBookingId ===
                            bookingId;


                        return (
                            <div className="flex justify-end gap-1">

                                <button
                                    type="button"
                                    onClick={() =>
                                        openDetails(
                                            booking
                                        )
                                    }
                                    disabled={
                                        isActionLoading
                                    }
                                    title="View reservation"
                                    aria-label="View reservation"
                                    className="
                                        rounded-lg
                                        p-2
                                        text-slate-400
                                        transition
                                        hover:bg-slate-100
                                        hover:text-slate-700
                                        disabled:opacity-50
                                    "
                                >
                                    {isActionLoading ? (
                                        <Loader2
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                            "
                                        />
                                    ) : (
                                        <Eye
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />
                                    )}
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        openEditForm(
                                            booking
                                        )
                                    }
                                    title="Edit reservation"
                                    aria-label="Edit reservation"
                                    className="
                                        rounded-lg
                                        p-2
                                        text-slate-400
                                        transition
                                        hover:bg-blue-50
                                        hover:text-blue-600
                                    "
                                >
                                    <Pencil
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />
                                </button>


                                {booking?.status !==
                                    "cancelled" &&
                                    booking?.status !==
                                    "completed" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openCancelModal(
                                                    booking
                                                )
                                            }
                                            title="Cancel reservation"
                                            aria-label="Cancel reservation"
                                            className="
                                                rounded-lg
                                                p-2
                                                text-slate-400
                                                transition
                                                hover:bg-red-50
                                                hover:text-red-600
                                            "
                                        >
                                            <XCircle
                                                className="
                                                    h-4
                                                    w-4
                                                "
                                            />
                                        </button>
                                    )}

                            </div>
                        );
                    },
                },

            ],
            [
                actionBookingId,
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
                Toast
            ========================================================= */}

            {toast && (
                <div
                    className="
                        fixed
                        right-4
                        top-20
                        z-[120]
                        w-[calc(100%-2rem)]
                        sm:right-6
                        sm:w-auto
                    "
                >
                    <Toast
                        {...toast}
                        onClose={() =>
                            setToast(null)
                        }
                    />
                </div>
            )}


            {/* =========================================================
                Page Header
            ========================================================= */}

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                <div>

                    <div className="flex items-center gap-2">

                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            Reservations
                        </h1>

                        <span
                            className="
                                rounded-full
                                bg-slate-100
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                text-slate-600
                            "
                        >
                            {pagination.total || 0}
                        </span>

                    </div>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        Manage restaurant reservations,
                        customers and table availability.
                    </p>

                </div>


                <Button
                    onClick={
                        openCreateForm
                    }
                >
                    <Plus className="h-4 w-4" />
                    New Reservation
                </Button>

            </div>


            {/* =========================================================
                Summary Cards
            ========================================================= */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    lg:grid-cols-4
                "
            >

                <SummaryCard
                    label="Total"
                    value={
                        statusSummary.total
                    }
                    icon={
                        CalendarDays
                    }
                />

                <SummaryCard
                    label="Confirmed"
                    value={
                        statusSummary.confirmed
                    }
                    icon={
                        CheckCircle2
                    }
                />

                <SummaryCard
                    label="Pending"
                    value={
                        statusSummary.pending
                    }
                    icon={
                        Clock3
                    }
                />

                <SummaryCard
                    label="Cancelled"
                    value={
                        statusSummary.cancelled
                    }
                    icon={
                        XCircle
                    }
                />

            </div>


            {/* =========================================================
                Toolbar
            ========================================================= */}

            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        lg:flex-row
                        lg:items-center
                    "
                >

                    {/* Search */}

                    <div
                        className="
                            relative
                            min-w-0
                            flex-1
                        "
                    >

                        <Search
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search customer, phone, email..."
                            className="
                                h-10
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
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:bg-white
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    <Button
                        variant="secondary"
                        onClick={() =>
                            setShowFilters(
                                (current) =>
                                    !current
                            )
                        }
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>


                    <button
                        type="button"
                        onClick={
                            loadBookings
                        }
                        disabled={
                            loading
                        }
                        title="Refresh reservations"
                        className="
                            flex
                            h-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            px-3
                            text-slate-500
                            transition
                            hover:bg-slate-50
                            hover:text-slate-900
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <RefreshCw
                            className={`
                                h-4
                                w-4
                                ${loading
                                    ? "animate-spin"
                                    : ""
                                }
                            `}
                        />
                    </button>

                </div>


                {/* Filters */}

                {showFilters && (
                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-1
                            gap-3
                            border-t
                            border-slate-100
                            pt-4
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >

                        <FilterSelect
                            label="Date"
                            type="date"
                            value={
                                filters.bookingDate
                            }
                            onChange={(value) =>
                                handleFilterChange(
                                    "bookingDate",
                                    value
                                )
                            }
                        />


                        <FilterSelect
                            label="Status"
                            value={
                                filters.status
                            }
                            options={
                                STATUS_OPTIONS
                            }
                            onChange={(value) =>
                                handleFilterChange(
                                    "status",
                                    value
                                )
                            }
                        />


                        <FilterSelect
                            label="Source"
                            value={
                                filters.bookingSource
                            }
                            options={
                                SOURCE_OPTIONS
                            }
                            onChange={(value) =>
                                handleFilterChange(
                                    "bookingSource",
                                    value
                                )
                            }
                        />


                        <FilterSelect
                            label="Payment"
                            value={
                                filters.paymentStatus
                            }
                            options={
                                PAYMENT_OPTIONS
                            }
                            onChange={(value) =>
                                handleFilterChange(
                                    "paymentStatus",
                                    value
                                )
                            }
                        />


                        <div className="sm:col-span-2 xl:col-span-4">

                            <button
                                type="button"
                                onClick={
                                    handleClearFilters
                                }
                                className="
                                    text-xs
                                    font-semibold
                                    text-blue-600
                                    hover:text-blue-700
                                "
                            >
                                Clear all filters
                            </button>

                        </div>

                    </div>
                )}

            </div>


            {/* =========================================================
                API Error
            ========================================================= */}

            {bookingError && (
                <div
                    className="
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        p-4
                    "
                >

                    <XCircle
                        className="
                            mt-0.5
                            h-5
                            w-5
                            shrink-0
                            text-red-600
                        "
                    />

                    <div className="min-w-0 flex-1">

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-red-900
                            "
                        >
                            Unable to load reservations
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-red-700
                            "
                        >
                            {bookingError}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={
                            loadBookings
                        }
                        className="
                            text-xs
                            font-semibold
                            text-red-700
                            hover:text-red-900
                        "
                    >
                        Retry
                    </button>

                </div>
            )}


            {/* =========================================================
                Table
            ========================================================= */}

            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >

                <Table
                    columns={
                        columns
                    }
                    data={
                        filteredBookings
                    }
                    loading={
                        loading
                    }
                    rowKey="_id"
                    emptyMessage={
                        search ||
                            filters.bookingDate ||
                            filters.status ||
                            filters.bookingSource ||
                            filters.paymentStatus
                            ? "No matching reservations"
                            : "No reservations yet"
                    }
                    emptyDescription={
                        search ||
                            filters.bookingDate ||
                            filters.status ||
                            filters.bookingSource ||
                            filters.paymentStatus
                            ? "Try changing your search or filters."
                            : "Create your first reservation to get started."
                    }
                />


                {!loading &&
                    pagination.totalPages >
                    0 && (
                        <Pagination
                            page={
                                pagination.page
                            }
                            totalPages={
                                pagination.totalPages
                            }
                            total={
                                pagination.total
                            }
                            limit={
                                pagination.limit
                            }
                            onPageChange={(
                                page
                            ) =>
                                dispatch(
                                    setBookingPage(
                                        page
                                    )
                                )
                            }
                            disabled={
                                loading
                            }
                        />
                    )}

            </div>


            {/* =========================================================
                Create / Edit Modal
            ========================================================= */}

            <Modal
                open={
                    formOpen
                }
                onClose={() => {

                    if (
                        creating ||
                        updating
                    ) {
                        return;
                    }

                    setFormOpen(
                        false
                    );
                }}
                title={
                    formMode ===
                        "create"
                        ? "New Reservation"
                        : "Edit Reservation"
                }
                description={
                    formMode ===
                        "create"
                        ? "Create a new restaurant reservation."
                        : "Update the reservation details."
                }
                size="lg"
                closeOnBackdrop={
                    !creating &&
                    !updating
                }
                closeOnEscape={
                    !creating &&
                    !updating
                }
                footer={
                    <>

                        <Button
                            variant="secondary"
                            onClick={() =>
                                setFormOpen(
                                    false
                                )
                            }
                            disabled={
                                creating ||
                                updating
                            }
                        >
                            Cancel
                        </Button>


                        <Button
                            variant="secondary"
                            onClick={
                                handleCheckAvailability
                            }
                            disabled={
                                availabilityLoading ||
                                creating ||
                                updating
                            }
                        >
                            {availabilityLoading ? (
                                <Loader2
                                    className="
                                        h-4
                                        w-4
                                        animate-spin
                                    "
                                />
                            ) : (
                                <CheckCircle2
                                    className="
                                        h-4
                                        w-4
                                    "
                                />
                            )}

                            Check Availability
                        </Button>


                        <Button
                            type="submit"
                            form="reservation-form"
                            disabled={
                                creating ||
                                updating ||
                                availabilityLoading
                            }
                        >
                            {(creating ||
                                updating) && (
                                    <Loader2
                                        className="
                                        h-4
                                        w-4
                                        animate-spin
                                    "
                                    />
                                )}

                            {formMode ===
                                "create"
                                ? "Create Reservation"
                                : "Save Changes"}
                        </Button>

                    </>
                }
            >

                <form
                    id="reservation-form"
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-6"
                >

                    {/* Customer */}

                    <FormSection
                        title="Customer"
                        description="Customer contact information."
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                            "
                        >

                            <Input
                                label="Full name"
                                name="name"
                                value={
                                    form.name
                                }
                                onChange={
                                    handleFormChange
                                }
                                error={
                                    formErrors.name
                                }
                                required
                            />


                            <Input
                                label="Phone number"
                                name="phone"
                                type="tel"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleFormChange
                                }
                                error={
                                    formErrors.phone
                                }
                                required
                            />


                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleFormChange
                                }
                            />

                        </div>

                    </FormSection>


                    {/* Reservation */}

                    <FormSection
                        title="Reservation"
                        description="Choose the date, time and party size."
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-3
                            "
                        >

                            <Input
                                label="Date"
                                name="bookingDate"
                                type="date"
                                value={
                                    form.bookingDate
                                }
                                onChange={
                                    handleFormChange
                                }
                                error={
                                    formErrors.bookingDate
                                }
                                required
                            />


                            <Input
                                label="Time"
                                name="startTime"
                                type="time"
                                value={
                                    form.startTime
                                }
                                onChange={
                                    handleFormChange
                                }
                                error={
                                    formErrors.startTime
                                }
                                required
                            />


                            <Input
                                label="Guests"
                                name="guestCount"
                                type="number"
                                min="1"
                                max="100"
                                value={
                                    form.guestCount
                                }
                                onChange={
                                    handleFormChange
                                }
                                error={
                                    formErrors.guestCount
                                }
                                required
                            />

                        </div>


                        {/* Availability */}

                        {availability.checked && (
                            <div
                                className={`
                                    mt-4
                                    rounded-xl
                                    border
                                    p-4
                                    ${availability.available
                                        ? "border-emerald-200 bg-emerald-50"
                                        : "border-amber-200 bg-amber-50"
                                    }
                                `}
                            >

                                <div className="flex items-start gap-3">

                                    {availability.available ? (
                                        <CheckCircle2
                                            className="
                                                mt-0.5
                                                h-5
                                                w-5
                                                shrink-0
                                                text-emerald-600
                                            "
                                        />
                                    ) : (
                                        <XCircle
                                            className="
                                                mt-0.5
                                                h-5
                                                w-5
                                                shrink-0
                                                text-amber-600
                                            "
                                        />
                                    )}


                                    <div>

                                        <p
                                            className={`
                                                text-sm
                                                font-semibold
                                                ${availability.available
                                                    ? "text-emerald-900"
                                                    : "text-amber-900"
                                                }
                                            `}
                                        >
                                            {availability.available
                                                ? "Table available"
                                                : "Table unavailable"}
                                        </p>


                                        <p
                                            className={`
                                                mt-1
                                                text-xs
                                                ${availability.available
                                                    ? "text-emerald-700"
                                                    : "text-amber-700"
                                                }
                                            `}
                                        >
                                            {availability.available
                                                ? availability.table
                                                    ? `Table ${availability
                                                        .table
                                                        ?.tableNumber ||
                                                    availability
                                                        .table
                                                        ?.name ||
                                                    ""
                                                    } is available${availability.endTime ? ` until ${availability.endTime}` : ""}.`
                                                    : "A suitable table is available."
                                                : availability.reason ||
                                                "No suitable table is available."}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        )}

                    </FormSection>


                    {/* Additional */}

                    <FormSection
                        title="Additional information"
                        description="Optional details for the restaurant team."
                    >

                        <div className="space-y-4">

                            <Input
                                label="Occasion"
                                name="occasion"
                                value={
                                    form.occasion
                                }
                                onChange={
                                    handleFormChange
                                }
                                placeholder="Birthday, anniversary, business dinner..."
                            />


                            <Input
                                label="Special request"
                                name="specialRequest"
                                value={
                                    form.specialRequest
                                }
                                onChange={
                                    handleFormChange
                                }
                                placeholder="Window seat, high chair, dietary request..."
                            />


                            <Input
                                label="Internal notes"
                                name="notes"
                                value={
                                    form.notes
                                }
                                onChange={
                                    handleFormChange
                                }
                                placeholder="Notes for restaurant staff..."
                            />

                        </div>

                    </FormSection>

                </form>

            </Modal>


            {/* =========================================================
                Details Modal
            ========================================================= */}

            <Modal
                open={
                    detailsOpen
                }
                onClose={() => {

                    setDetailsOpen(
                        false
                    );

                    dispatch(
                        clearSelectedBooking()
                    );
                }}
                title="Reservation Details"
                description="Complete information for this reservation."
                size="md"
            >

                {selectedBooking && (
                    <div className="space-y-6">

                        <div
                            className="
                                flex
                                items-center
                                gap-4
                                rounded-xl
                                bg-slate-50
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-100
                                    text-lg
                                    font-bold
                                    text-blue-700
                                "
                            >
                                {getCustomerName(
                                    selectedBooking
                                )
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="min-w-0">

                                <p
                                    className="
                                        text-base
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    {getCustomerName(
                                        selectedBooking
                                    )}
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    {getCustomerPhone(
                                        selectedBooking
                                    )}
                                </p>

                            </div>

                            <div className="ml-auto">

                                <Badge
                                    variant={
                                        STATUS_BADGE_MAP[
                                        selectedBooking
                                            .status
                                        ] ||
                                        "default"
                                    }
                                >
                                    {formatStatus(
                                        selectedBooking.status
                                    )}
                                </Badge>

                            </div>

                        </div>


                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-4
                            "
                        >

                            <DetailItem
                                label="Date"
                                value={formatDate(
                                    selectedBooking.bookingDate
                                )}
                            />

                            <DetailItem
                                label="Time"
                                value={formatTime(
                                    selectedBooking.startTime
                                )}
                            />

                            <DetailItem
                                label="Guests"
                                value={
                                    selectedBooking.guestCount
                                }
                            />

                            <DetailItem
                                label="Source"
                                value={formatStatus(
                                    selectedBooking.bookingSource
                                )}
                            />

                            <DetailItem
                                label="Email"
                                value={
                                    selectedBooking.email ||
                                    "—"
                                }
                            />

                            <DetailItem
                                label="Payment"
                                value={formatStatus(
                                    selectedBooking.paymentStatus
                                )}
                            />

                        </div>


                        {selectedBooking.occasion && (
                            <DetailBlock
                                label="Occasion"
                                value={
                                    selectedBooking.occasion
                                }
                            />
                        )}


                        {selectedBooking.specialRequest && (
                            <DetailBlock
                                label="Special Request"
                                value={
                                    selectedBooking.specialRequest
                                }
                            />
                        )}


                        {selectedBooking.notes && (
                            <DetailBlock
                                label="Notes"
                                value={
                                    selectedBooking.notes
                                }
                            />
                        )}

                    </div>
                )}

            </Modal>


            {/* =========================================================
                Cancel Modal
            ========================================================= */}

            <Modal
                open={
                    cancelOpen
                }
                onClose={() => {

                    if (
                        !cancelling
                    ) {
                        setCancelOpen(
                            false
                        );
                    }
                }}
                title="Cancel Reservation"
                description="This action will mark the reservation as cancelled."
                size="sm"
                footer={
                    <>

                        <Button
                            variant="secondary"
                            onClick={() =>
                                setCancelOpen(
                                    false
                                )
                            }
                            disabled={
                                cancelling
                            }
                        >
                            Keep Reservation
                        </Button>


                        <Button
                            variant="danger"
                            onClick={
                                handleCancel
                            }
                            disabled={
                                cancelling
                            }
                        >
                            {cancelling && (
                                <Loader2
                                    className="
                                        h-4
                                        w-4
                                        animate-spin
                                    "
                                />
                            )}

                            Cancel Reservation
                        </Button>

                    </>
                }
            >

                <div className="space-y-4">

                    <div
                        className="
                            rounded-xl
                            border
                            border-red-100
                            bg-red-50
                            p-4
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-red-900
                            "
                        >
                            {selectedBooking
                                ? getCustomerName(
                                    selectedBooking
                                )
                                : "Reservation"}
                        </p>

                        {selectedBooking && (
                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-red-700
                                "
                            >
                                {formatDate(
                                    selectedBooking.bookingDate
                                )}
                                {" · "}
                                {formatTime(
                                    selectedBooking.startTime
                                )}
                                {" · "}
                                {
                                    selectedBooking.guestCount
                                }{" "}
                                guests
                            </p>
                        )}

                    </div>


                    <Input
                        label="Cancellation reason"
                        value={
                            cancelReason
                        }
                        onChange={(event) =>
                            setCancelReason(
                                event.target.value
                            )
                        }
                        placeholder="Optional reason..."
                    />

                </div>

            </Modal>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Summary Card
|--------------------------------------------------------------------------
*/

const SummaryCard = ({
    label,
    value,
    icon: Icon,
}) => {

    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                sm:p-5
            "
        >

            <div className="flex items-center justify-between">

                <div>

                    <p
                        className="
                            text-xs
                            font-medium
                            text-slate-500
                        "
                    >
                        {label}
                    </p>

                    <p
                        className="
                            mt-1
                            text-xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-2xl
                        "
                    >
                        {value}
                    </p>

                </div>


                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-600
                    "
                >
                    <Icon className="h-5 w-5" />
                </div>

            </div>

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
    type = "select",
    value,
    options = [],
    onChange,
}) => {

    return (
        <label className="block">

            <span
                className="
                    mb-1.5
                    block
                    text-xs
                    font-semibold
                    text-slate-600
                "
            >
                {label}
            </span>


            {type === "date" ? (
                <input
                    type="date"
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-sm
                        text-slate-700
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                    "
                />
            ) : (
                <select
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-sm
                        text-slate-700
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                    "
                >

                    {options.map(
                        (option) => (
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
            )}

        </label>
    );
};


/*
|--------------------------------------------------------------------------
| Form Section
|--------------------------------------------------------------------------
*/

const FormSection = ({
    title,
    description,
    children,
}) => {

    return (
        <section>

            <div className="mb-4">

                <h3
                    className="
                        text-sm
                        font-semibold
                        text-slate-900
                    "
                >
                    {title}
                </h3>

                {description && (
                    <p
                        className="
                            mt-0.5
                            text-xs
                            text-slate-500
                        "
                    >
                        {description}
                    </p>
                )}

            </div>

            {children}

        </section>
    );
};


/*
|--------------------------------------------------------------------------
| Detail Item
|--------------------------------------------------------------------------
*/

const DetailItem = ({
    label,
    value,
}) => {

    return (
        <div>

            <p
                className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    break-words
                    text-sm
                    font-medium
                    text-slate-800
                "
            >
                {value || "—"}
            </p>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Detail Block
|--------------------------------------------------------------------------
*/

const DetailBlock = ({
    label,
    value,
}) => {

    return (
        <div
            className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50
                p-4
            "
        >

            <p
                className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-2
                    whitespace-pre-wrap
                    text-sm
                    leading-6
                    text-slate-700
                "
            >
                {value}
            </p>

        </div>
    );
};


export default Reservations;
