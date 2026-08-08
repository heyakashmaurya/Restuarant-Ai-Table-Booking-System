import { findBooking } from "./findBooking.js";

/*
|--------------------------------------------------------------------------
| Get Booking
|--------------------------------------------------------------------------
|
| Retrieves a customer's booking using:
|
| 1. Booking ID
| 2. Confirmation Code
| 3. Phone Number
|
| This service intentionally uses findBooking()
| so booking lookup logic stays in one place.
|
|--------------------------------------------------------------------------
*/

export const getBooking = async ({
    bookingId,
    confirmationCode,
    phone,
}) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | Validate Search Parameters
        |--------------------------------------------------------------------------
        */

        if (
            !bookingId &&
            !confirmationCode &&
            !phone
        ) {

            return {
                success: false,
                booking: null,
                message:
                    "Please provide a booking ID, confirmation code, or phone number.",
            };

        }

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

        /*
        |--------------------------------------------------------------------------
        | Booking Not Found
        |--------------------------------------------------------------------------
        */

        if (!booking) {

            return {

                success: false,

                booking: null,

                message:
                    "No booking was found with the provided details.",

            };

        }

        /*
        |--------------------------------------------------------------------------
        | Return Booking
        |--------------------------------------------------------------------------
        */

        return {

            success: true,

            booking,

            message:
                "Booking retrieved successfully.",

        };

    }

    catch (error) {

        console.error(
            "Get Booking Error:",
            error
        );

        throw error;

    }

};