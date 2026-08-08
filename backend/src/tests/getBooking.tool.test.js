
import dotenv from "dotenv";

dotenv.config();

import connectDB from "../config/db.js";

/*
|--------------------------------------------------------------------------
| Register Mongoose Models
|--------------------------------------------------------------------------
|
| Booking references Customer and Table.
| These imports ensure both models are registered before populate()
| is executed.
|
|--------------------------------------------------------------------------
*/

import "../models/Customer.js";
import "../models/Table.js";
import "../models/Booking.js";

import {
    getBooking,
} from "../tools/booking/getBooking.js";


const runTest = async () => {
    try {

        console.log("1️⃣ Connecting to MongoDB...");

        await connectDB();

        console.log("✅ MongoDB connected");


        /*
        |--------------------------------------------------------------------------
        | Test Booking Lookup
        |--------------------------------------------------------------------------
        |
        | Use a real confirmation code from your database.
        |
        |--------------------------------------------------------------------------
        */

        const confirmationCode = "RB-O424FQ";


        console.log(
            "2️⃣ Testing getBooking tool..."
        );


        const result = await getBooking({
            confirmationCode,
        });


        console.log(
            "\nGet Booking Tool Result:"
        );


        console.dir(result, {
            depth: null,
        });


        /*
        |--------------------------------------------------------------------------
        | Validate Result
        |--------------------------------------------------------------------------
        */

        if (!result.success) {

            throw new Error(
                result.message ||
                "Get booking tool failed."
            );

        }


        if (!result.booking) {

            throw new Error(
                "Booking object was not returned."
            );

        }


        if (!result.booking.id) {

            throw new Error(
                "Booking ID was not returned."
            );

        }


        if (!result.booking.confirmationCode) {

            throw new Error(
                "Confirmation code was not returned."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        console.log(
            "\n✅ getBooking tool test passed."
        );


        console.log({

            bookingId:
                result.booking.id,

            confirmationCode:
                result.booking.confirmationCode,

            status:
                result.booking.status,

            guestCount:
                result.booking.guestCount,

            tableNumber:
                result.booking.table?.tableNumber,

            customerName:
                result.booking.customer?.name,

        });


        process.exit(0);

    } catch (error) {

        console.error(
            "\n❌ getBooking tool test failed."
        );

        console.error(error);

        process.exit(1);

    }
};


runTest();



