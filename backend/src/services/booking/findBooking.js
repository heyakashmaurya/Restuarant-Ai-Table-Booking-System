import Booking from "../../models/Booking.js";
import Customer from "../../models/Customer.js";

/*
|--------------------------------------------------------------------------
| Find Booking Service
|--------------------------------------------------------------------------
*/

export const findBooking = async ({
    confirmationCode,
    phone,
    bookingId,
}) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | Search by Confirmation Code
        |--------------------------------------------------------------------------
        */

        if (confirmationCode) {

            const booking = await Booking.findOne({

                confirmationCode,

                isDeleted: false,

            })
                .populate("customer")
                .populate("table");

            return booking;

        }

        /*
        |--------------------------------------------------------------------------
        | Search by Phone Number
        |--------------------------------------------------------------------------
        */

        if (phone) {

            const customer = await Customer.findOne({

                phone,

                isDeleted: false,

            });

            if (!customer) {

                return null;

            }

            const booking = await Booking.findOne({

                customer: customer._id,

                isDeleted: false,

                status: {
                    $in: [
                        "Pending",
                        "Confirmed",
                        "Seated",
                    ],
                },

            })
                .sort({
                    bookingDate: 1,
                    createdAt: -1,
                })
                .populate("customer")
                .populate("table");

            return booking;

        }

        /*
        |--------------------------------------------------------------------------
        | Search by Booking ID
        |--------------------------------------------------------------------------
        */

        if (bookingId) {

            const booking = await Booking.findOne({

                _id: bookingId,

                isDeleted: false,

            })
                .populate("customer")
                .populate("table");

            return booking;

        }

        return null;

    }

    catch (error) {

        console.error(
            "Find Booking Error:",
            error
        );

        throw error;

    }

};