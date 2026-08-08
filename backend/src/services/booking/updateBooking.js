import Booking from "../../models/Booking.js";

import { findBooking } from "./findBooking.js";
import { checkAvailability } from "./checkAvailability.js";

/*
|--------------------------------------------------------------------------
| Update Booking
|--------------------------------------------------------------------------
*/

export const updateBooking = async ({

    bookingId,

    confirmationCode,

    phone,

    bookingDate,

    startTime,

    guestCount,

    specialRequest,

    occasion,

    notes,

    status,

}) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | Find Existing Booking
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
        | Determine Updated Values
        |--------------------------------------------------------------------------
        */

        const newDate =
            bookingDate || booking.bookingDate;

        const newTime =
            startTime || booking.startTime;

        const newGuests =
            guestCount || booking.guestCount;

        /*
        |--------------------------------------------------------------------------
        | Check Availability
        |--------------------------------------------------------------------------
        */

        const changed =

            newDate.toString() !== booking.bookingDate.toString()

            ||

            newTime !== booking.startTime

            ||

            newGuests !== booking.guestCount;

        if (changed) {

            const availability = await checkAvailability({

                bookingDate: newDate,

                startTime: newTime,

                guestCount: newGuests,

            });

            if (!availability.available) {

                return {

                    success: false,

                    message: availability.reason,

                };

            }

            booking.table = availability.table._id;

        }

        /*
        |--------------------------------------------------------------------------
        | Update Fields
        |--------------------------------------------------------------------------
        */

        booking.bookingDate = newDate;

        booking.startTime = newTime;

        booking.guestCount = newGuests;

        if (specialRequest !== undefined) {

            booking.specialRequest = specialRequest;

        }

        if (occasion !== undefined) {

            booking.occasion = occasion;

        }

        if (notes !== undefined) {

            booking.notes = notes;

        }

        if (status !== undefined) {

            booking.status = status;

        }

        /*
        |--------------------------------------------------------------------------
        | Save
        |--------------------------------------------------------------------------
        */

        await booking.save();

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

            message: "Booking updated successfully.",

        };

    }

    catch (error) {

        console.error(

            "Update Booking Error:",

            error

        );

        throw error;

    }

};