
import { findBooking } from "./findBooking.js";

/*
|--------------------------------------------------------------------------
| Cancel Booking Service
|--------------------------------------------------------------------------
*/

export const cancelBooking = async ({
    bookingId,
    confirmationCode,
    phone,
    reason = "Cancelled by customer",
    cancelledBy = null,
}) => {
    try {
        /*
        |--------------------------------------------------------------------------
        | Find Booking
        |--------------------------------------------------------------------------
        */

        const booking = await findBooking({
            bookingId,
            confirmationCode,
            phone,
        });

        if (!booking) {
            return {
                success: false,
                booking: null,
                message: "Booking not found.",
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Already Cancelled
        |--------------------------------------------------------------------------
        */

        if (booking.status === "cancelled") {
            return {
                success: false,
                booking,
                message: "Booking is already cancelled.",
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent Cancelling Completed Booking
        |--------------------------------------------------------------------------
        */

        if (booking.status === "completed") {
            return {
                success: false,
                booking,
                message: "Completed booking cannot be cancelled.",
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent Cancelling No-Show Booking
        |--------------------------------------------------------------------------
        */

        if (booking.status === "no_show") {
            return {
                success: false,
                booking,
                message: "No-show booking cannot be cancelled.",
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Update Cancellation Information
        |--------------------------------------------------------------------------
        */

        booking.status = "cancelled";

        booking.cancelReason = reason;

        booking.cancelledBy = cancelledBy;

        booking.cancelledAt = new Date();

        /*
        |--------------------------------------------------------------------------
        | Save Booking
        |--------------------------------------------------------------------------
        */

        await booking.save();

        /*
        |--------------------------------------------------------------------------
        | Populate Relations
        |--------------------------------------------------------------------------
        */

        await booking.populate([
            {
                path: "customer",
            },
            {
                path: "table",
            },
        ]);

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return {
            success: true,
            booking,
            message: "Booking cancelled successfully.",
        };

    } catch (error) {
        console.error(
            "Cancel Booking Error:",
            error
        );

        throw error;
    }
};

