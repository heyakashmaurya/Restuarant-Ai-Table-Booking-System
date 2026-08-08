

// import { findBooking } from "./booking.service.js";
import { findBooking } from "./findBooking.js";

export const cancelBooking = async ({

    bookingId,

    confirmationCode,

    phone,

    reason = "Cancelled by customer",

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

                message: "Booking not found.",

            };

        }

        /*
        |--------------------------------------------------------------------------
        | Already Cancelled
        |--------------------------------------------------------------------------
        */

        if (booking.status === "Cancelled") {

            return {

                success: false,

                message: "Booking is already cancelled.",

            };

        }

        /*
        |--------------------------------------------------------------------------
        | Update Booking
        |--------------------------------------------------------------------------
        */

        booking.status = "cancelled";

        booking.cancelledAt = new Date();

        booking.cancellationReason = reason;

        await booking.save();

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

    }

    catch (error) {

        console.error(

            "Cancel Booking Error:",

            error

        );

        throw error;

    }

};