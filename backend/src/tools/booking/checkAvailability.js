import { checkAvailability as checkBookingAvailability } from "../../services/booking/checkAvailability.js";

/*
|--------------------------------------------------------------------------
| Check Booking Availability Tool
|--------------------------------------------------------------------------
|
| This is the AI-facing wrapper around the booking availability service.
|
| IMPORTANT:
| - No MongoDB queries here.
| - No table-selection logic here.
| - No booking creation here.
| - The service layer remains responsible for business logic.
|
|--------------------------------------------------------------------------
*/

export const checkAvailability = async ({
    bookingDate,
    startTime,
    guestCount,
}) => {
    try {
        /*
        |--------------------------------------------------------------------------
        | Validate Required Inputs
        |--------------------------------------------------------------------------
        */

        if (!bookingDate) {
            return {
                success: false,
                available: false,
                table: null,
                message: "Booking date is required.",
            };
        }

        if (!startTime) {
            return {
                success: false,
                available: false,
                table: null,
                message: "Booking time is required.",
            };
        }

        if (
            guestCount === undefined ||
            guestCount === null
        ) {
            return {
                success: false,
                available: false,
                table: null,
                message: "Guest count is required.",
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Guest Count
        |--------------------------------------------------------------------------
        */

        const parsedGuestCount = Number(guestCount);

        if (
            !Number.isInteger(parsedGuestCount) ||
            parsedGuestCount < 1 ||
            parsedGuestCount > 100
        ) {
            return {
                success: false,
                available: false,
                table: null,
                message: "Guest count must be a whole number between 1 and 100.",
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Call Booking Service
        |--------------------------------------------------------------------------
        */

        const result = await checkBookingAvailability({
            bookingDate,
            startTime,
            guestCount: parsedGuestCount,
        });

        /*
        |--------------------------------------------------------------------------
        | Availability Result
        |--------------------------------------------------------------------------
        */

        if (!result.available) {
            return {
                success: true,
                available: false,
                table: null,
                message:
                    result.reason ||
                    "No table is available at the selected time.",
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Return AI-Friendly Table Information
        |--------------------------------------------------------------------------
        */

        return {
            success: true,
            available: true,

            table: result.table
                ? {
                    id: result.table._id?.toString(),
                    tableNumber: result.table.tableNumber,
                    tableName: result.table.tableName || "",
                    capacity: result.table.capacity,
                    location: result.table.location,
                    floor: result.table.floor,
                }
                : null,

            endTime: result.endTime || "",

            message: "Table is available.",
        };

    } catch (error) {
        console.error(
            "Check Availability Tool Error:",
            error
        );

        return {
            success: false,
            available: false,
            table: null,
            message:
                "Unable to check table availability right now.",
        };
    }
};