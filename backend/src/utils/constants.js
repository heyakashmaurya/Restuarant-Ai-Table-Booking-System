/*
|--------------------------------------------------------------------------
| User Roles
|--------------------------------------------------------------------------
*/

export const USER_ROLES = {
    OWNER: "Owner",
    MANAGER: "Manager",
    STAFF: "Staff",
};

/*
|--------------------------------------------------------------------------
| Table Status
|--------------------------------------------------------------------------
*/

export const TABLE_STATUS = {
    AVAILABLE: "Available",
    RESERVED: "Reserved",
    OCCUPIED: "Occupied",
    MAINTENANCE: "Maintenance",
};

/*
|--------------------------------------------------------------------------
| Table Locations
|--------------------------------------------------------------------------
*/

export const TABLE_LOCATION = {
    INDOOR: "Indoor",
    OUTDOOR: "Outdoor",
    WINDOW: "Window",
    PRIVATE: "Private",
};

/*
|--------------------------------------------------------------------------
| Booking Status
|--------------------------------------------------------------------------
*/

export const BOOKING_STATUS = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SEATED: "Seated",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NO_SHOW: "No Show",
};

/*
|--------------------------------------------------------------------------
| Booking Source
|--------------------------------------------------------------------------
*/

export const BOOKING_SOURCE = {
    AI: "AI Voice",
    DASHBOARD: "Dashboard",
    WEBSITE: "Website",
    WALKIN: "Walk-in",
    WHATSAPP: "WhatsApp",
};

/*
|--------------------------------------------------------------------------
| Payment Status
|--------------------------------------------------------------------------
*/

export const PAYMENT_STATUS = {
    PENDING: "Pending",
    PAID: "Paid",
    REFUNDED: "Refunded",
    NOT_REQUIRED: "Not Required",
};