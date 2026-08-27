import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB  from "../config/db.js";

import Booking from "../models/Booking.js";
import Customer from "../models/Customer.js";
import Table from "../models/Table.js";

import { updateBooking } from "../tools/booking/updateBooking.js";

dotenv.config();

/*
|--------------------------------------------------------------------------
| Update Booking Tool Test
|-------------------------------------------j-------------------------------
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
        | 2. Find an Existing Active Booking
        |--------------------------------------------------------------------------
        */

        console.log("\n2️⃣ Finding an existing booking...");

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
            })
            .lean();

        if (!booking) {

            throw new Error(
                "No active booking found for update test."
            );

        }

        console.log("✅ Existing booking found");

        console.log({

            bookingId: booking._id.toString(),

            confirmationCode:
                booking.confirmationCode,

            status: booking.status,

            guestCount:
                booking.guestCount,

        });

        /*
        |--------------------------------------------------------------------------
        | 3. Testing updateBooking Tool
        |--------------------------------------------------------------------------
        */

        console.log("\n3️⃣ Testing updateBooking tool...");

        const originalGuestCount =
            booking.guestCount;

        const originalSpecialRequest =
            booking.specialRequest || "";

        /*
        |--------------------------------------------------------------------------
        | Use a safe test update
        |--------------------------------------------------------------------------
        |
        | We intentionally update only fields that do not require
        | changing the reservation date/time/table.
        |
        */

        const updatedGuestCount =
            originalGuestCount < 4
                ? originalGuestCount + 1
                : originalGuestCount - 1;

        const result = await updateBooking({

            bookingId:
                booking._id.toString(),

            guestCount:
                updatedGuestCount,

            specialRequest:
                "Updated by updateBooking tool test",

        });

        console.log("\nUpdate Booking Tool Result:");

        console.dir(
            result,
            {
                depth: 6,
            }
        );

        /*
        |--------------------------------------------------------------------------
        | 4. Validate Tool Response
        |--------------------------------------------------------------------------
        */

        if (!result) {

            throw new Error(
                "updateBooking tool returned no result."
            );

        }

        if (!result.success) {

            throw new Error(

                result.message ||
                "updateBooking tool failed."

            );

        }

        if (!result.booking) {

            throw new Error(
                "updateBooking tool did not return the updated booking."
            );

        }

        console.log(
            "\n✅ updateBooking tool returned success."
        );

        /*
        |--------------------------------------------------------------------------
        | 5. Verify Guest Count
        |--------------------------------------------------------------------------
        */

        if (
            result.booking.guestCount !==
            updatedGuestCount
        ) {

            throw new Error(

                `Guest count was not updated correctly. ` +
                `Expected ${updatedGuestCount}, ` +
                `got ${result.booking.guestCount}.`

            );

        }

        console.log(
            "✅ Guest count updated correctly."
        );

        /*
        |--------------------------------------------------------------------------
        | 6. Verify Special Request
        |--------------------------------------------------------------------------
        */

        if (
            result.booking.specialRequest !==
            "Updated by updateBooking tool test"
        ) {

            throw new Error(
                "Special request was not updated correctly."
            );

        }

        console.log(
            "✅ Special request updated correctly."
        );

        /*
        |--------------------------------------------------------------------------
        | 7. Verify Database
        |--------------------------------------------------------------------------
        */

        console.log(
            "\n4️⃣ Verifying updated booking in database..."
        );

        const updatedBooking =
            await Booking.findById(
                booking._id
            )
                .populate("customer")
                .populate("table");

        if (!updatedBooking) {

            throw new Error(
                "Updated booking could not be found in database."
            );

        }

        console.log("\nUpdated booking:");

        console.dir(

            {

                bookingId:
                    updatedBooking._id.toString(),

                confirmationCode:
                    updatedBooking.confirmationCode,

                guestCount:
                    updatedBooking.guestCount,

                specialRequest:
                    updatedBooking.specialRequest,

                status:
                    updatedBooking.status,

            },

            {
                depth: 5,
            }

        );

        /*
        |--------------------------------------------------------------------------
        | 8. Final Verification
        |--------------------------------------------------------------------------
        */

        if (
            updatedBooking.guestCount !==
            updatedGuestCount
        ) {

            throw new Error(
                "Database guest count verification failed."
            );

        }

        if (
            updatedBooking.specialRequest !==
            "Updated by updateBooking tool test"
        ) {

            throw new Error(
                "Database special request verification failed."
            );

        }

        console.log(
            "\n✅ Database update verified."
        );

        /*
        |--------------------------------------------------------------------------
        | Test Passed
        |--------------------------------------------------------------------------
        */

        console.log(
            "\n========================================"
        );

        console.log(
            "🎉 UPDATE BOOKING TOOL TEST PASSED"
        );

        console.log(
            "========================================"
        );

    }

    catch (error) {

        console.error(
            "\n❌ UPDATE BOOKING TOOL TEST FAILED"
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

        await mongoose.connection.close();

        console.log(
            "\n✅ MongoDB connection closed."
        );

    }

};

/*
|--------------------------------------------------------------------------
| Run Test
|--------------------------------------------------------------------------
*/

runTest();