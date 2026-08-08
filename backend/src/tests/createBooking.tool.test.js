import dotenv from "dotenv";

dotenv.config();

import connectDB from "../config/db.js";

import {
    createBooking,
} from "../tools/booking/createBooking.js";

const runTest = async () => {
    try {
        console.log("1️⃣ Connecting to MongoDB...");

        await connectDB();

        console.log("✅ MongoDB connected");

        /*
        |--------------------------------------------------------------------------
        | Test Create Booking Tool
        |--------------------------------------------------------------------------
        */

        console.log(
            "2️⃣ Testing createBooking tool..."
        );

        const result = await createBooking({
            name: "Create Booking Tool Test",
            phone: "9999999998",
            email: "tooltest@example.com",

            bookingDate: "2026-08-11",
            startTime: "19:00",
            guestCount: 2,

            specialRequest:
                "Automated create booking tool test",

            occasion: "Test",

            notes:
                "Temporary test booking",
        });

        console.log(
            "\nCreate Booking Tool Result:"
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
                "Create booking tool failed."
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

        if (!result.booking.table) {
            throw new Error(
                "Assigned table was not returned."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        console.log(
            "\n✅ createBooking tool test passed."
        );

        console.log({
            bookingId: result.booking.id,
            confirmationCode:
                result.booking.confirmationCode,
            tableNumber:
                result.booking.table.tableNumber,
            status:
                result.booking.status,
        });

        process.exit(0);

    } catch (error) {
        console.error(
            "\n❌ createBooking tool test failed."
        );

        console.error(error);

        process.exit(1);
    }
};

runTest();