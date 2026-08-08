import mongoose from "mongoose";

import connectDB  from "../config/db.js";
import { cancelBooking } from "../tools/booking/cancelBooking.js";
import Booking from "../models/Booking.js";
import Table from "../models/Table.js";
import Customer from "../models/Customer.js";

/*
|--------------------------------------------------------------------------
| Cancel Booking Tool Test
|--------------------------------------------------------------------------
*/

const runTest = async () => {

    try {

        /*
        |--------------------------------------------------------------------------
        | 1. Connect to MongoDB
        |--------------------------------------------------------------------------
        */

        console.log("1️⃣ Connecting to MongoDB...");

        await connectDB();

        console.log("✅ MongoDB connected");


        /*
        |--------------------------------------------------------------------------
        | 2. Find an active booking for testing
        |--------------------------------------------------------------------------
        */

        console.log("\n2️⃣ Finding an active booking...");

        const booking = await Booking.findOne({

            isDeleted: false,

            status: {
                $in: [
                    "pending",
                    "confirmed",
                    "seated",
                ],
            },

        })
            .sort({
                createdAt: -1,
            });

        if (!booking) {

            throw new Error(
                "No active booking found for cancellation test."
            );

        }

        console.log("✅ Active booking found.");

        console.log({

            bookingId: booking._id.toString(),

            confirmationCode:
                booking.confirmationCode,

            status:
                booking.status,

        });


        /*
        |--------------------------------------------------------------------------
        | 3. Testing cancelBooking tool
        |--------------------------------------------------------------------------
        */

        console.log("\n3️⃣ Testing cancelBooking tool...");

        const result = await cancelBooking({

            bookingId:
                booking._id.toString(),

            reason:
                "Cancel booking tool test",

        });

        console.log(
            "Cancel Booking Tool Result:"
        );

        console.dir(
            result,
            {
                depth: 5,
            }
        );


        /*
        |--------------------------------------------------------------------------
        | 4. Verify tool response
        |--------------------------------------------------------------------------
        */

        if (!result) {

            throw new Error(
                "cancelBooking tool returned no result."
            );

        }

        if (!result.success) {

            throw new Error(
                result.message ||
                "cancelBooking tool failed."
            );

        }

        if (!result.booking) {

            throw new Error(
                "cancelBooking tool did not return the booking."
            );

        }

        console.log(
            "✅ cancelBooking tool returned success."
        );


        /*
        |--------------------------------------------------------------------------
        | 5. Verify database record
        |--------------------------------------------------------------------------
        */

        console.log(
            "\n4️⃣ Verifying cancelled booking in database..."
        );

        const updatedBooking =
            await Booking.findById(
                booking._id
            );

        if (!updatedBooking) {

            throw new Error(
                "Booking could not be found after cancellation."
            );

        }

        console.log({

            bookingId:
                updatedBooking._id.toString(),

            status:
                updatedBooking.status,

            cancelledAt:
                updatedBooking.cancelledAt,

            cancelReason:
                updatedBooking.cancelReason,

        });


        /*
        |--------------------------------------------------------------------------
        | 6. Verify status
        |--------------------------------------------------------------------------
        */

        if (updatedBooking.status !== "cancelled") {

            throw new Error(
                `Booking status is not cancelled. Current status: ${updatedBooking.status}`
            );

        }

        console.log(
            "✅ Booking status correctly changed to cancelled."
        );


        /*
        |--------------------------------------------------------------------------
        | 7. Verify cancellation timestamp
        |--------------------------------------------------------------------------
        */

        if (!updatedBooking.cancelledAt) {

            throw new Error(
                "cancelledAt was not set."
            );

        }

        console.log(
            "✅ Cancellation timestamp verified."
        );


        /*
        |--------------------------------------------------------------------------
        | 8. Verify cancellation reason
        |--------------------------------------------------------------------------
        */

        if (
            updatedBooking.cancelReason !==
            "Cancel booking tool test"
        ) {

            throw new Error(
                `Cancellation reason is incorrect. Current reason: ${updatedBooking.cancelReason}`
            );

        }

        console.log(
            "✅ Cancellation reason verified."
        );


        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        console.log("\n========================================");

        console.log(
            "🎉 CANCEL BOOKING TOOL TEST PASSED"
        );

        console.log(
            "========================================"
        );

    }
    catch (error) {

        console.error(
            "\n❌ CANCEL BOOKING TOOL TEST FAILED"
        );

        console.error(error);

        process.exitCode = 1;

    }
    finally {

        /*
        |--------------------------------------------------------------------------
        | Close MongoDB Connection
        |--------------------------------------------------------------------------
        */

        if (
            mongoose.connection.readyState !== 0
        ) {

            await mongoose.connection.close();

            console.log(
                "\n✅ MongoDB connection closed."
            );

        }

    }

};


/*
|--------------------------------------------------------------------------
| Run Test
|--------------------------------------------------------------------------
*/

runTest();