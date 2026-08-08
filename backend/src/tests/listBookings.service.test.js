import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB  from "../config/db.js";
import Booking from "../models/Booking.js";
import Customer from "../models/Customer.js";
import Table from "../models/Table.js";
import { listBookings } from "../services/booking/listBookings.js";

dotenv.config();

/*
|--------------------------------------------------------------------------
| List Bookings Service Test
|--------------------------------------------------------------------------
*/

const runTest = async () => {

    try {

        /*
        |--------------------------------------------------------------------------
        | 1. Connect MongoDB
        |--------------------------------------------------------------------------
        */

        console.log("1️⃣ Connecting to MongoDB...");

        await connectDB();

        console.log("✅ MongoDB connected");

        /*
        |--------------------------------------------------------------------------
        | 2. Check Existing Bookings
        |--------------------------------------------------------------------------
        */

        console.log("\n2️⃣ Checking existing bookings...");

        const existingBookingCount =
            await Booking.countDocuments({
                isDeleted: false,
            });

        console.log(
            `✅ Active bookings found: ${existingBookingCount}`
        );

        /*
        |--------------------------------------------------------------------------
        | 3. Test List All Bookings
        |--------------------------------------------------------------------------
        */

        console.log("\n3️⃣ Testing listBookings...");

        const result = await listBookings({
            page: 1,
            limit: 10,
        });

        console.log(
            "List bookings result:"
        );

        console.dir(
            result,
            {
                depth: 3,
            }
        );

        /*
        |--------------------------------------------------------------------------
        | 4. Validate Result
        |--------------------------------------------------------------------------
        */

        if (!result.success) {

            throw new Error(
                result.message ||
                "listBookings returned success: false"
            );

        }

        if (!Array.isArray(result.bookings)) {

            throw new Error(
                "bookings must be an array."
            );

        }

        if (
            typeof result.total !== "number"
        ) {

            throw new Error(
                "total must be a number."
            );

        }

        if (
            typeof result.page !== "number"
        ) {

            throw new Error(
                "page must be a number."
            );

        }

        if (
            typeof result.limit !== "number"
        ) {

            throw new Error(
                "limit must be a number."
            );

        }

        if (
            typeof result.totalPages !== "number"
        ) {

            throw new Error(
                "totalPages must be a number."
            );

        }

        console.log(
            "✅ Basic listBookings test passed."
        );

        /*
        |--------------------------------------------------------------------------
        | 5. Test Pagination
        |--------------------------------------------------------------------------
        */

        console.log("\n4️⃣ Testing pagination...");

        const paginationResult =
            await listBookings({
                page: 1,
                limit: 2,
            });

        console.log({
            success: paginationResult.success,
            returnedBookings:
                paginationResult.bookings.length,
            total: paginationResult.total,
            page: paginationResult.page,
            limit: paginationResult.limit,
            totalPages:
                paginationResult.totalPages,
        });

        if (!paginationResult.success) {

            throw new Error(
                "Pagination test failed."
            );

        }

        if (
            paginationResult.bookings.length > 2
        ) {

            throw new Error(
                "Pagination limit was not respected."
            );

        }

        console.log(
            "✅ Pagination test passed."
        );

        /*
        |--------------------------------------------------------------------------
        | 6. Test Status Filter
        |--------------------------------------------------------------------------
        */

        console.log("\n5️⃣ Testing status filter...");

        const confirmedResult =
            await listBookings({
                status: "confirmed",
                page: 1,
                limit: 10,
            });

        console.log({
            success: confirmedResult.success,
            returnedBookings:
                confirmedResult.bookings.length,
            total: confirmedResult.total,
        });

        if (!confirmedResult.success) {

            throw new Error(
                "Status filter test failed."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Verify Every Booking Has Confirmed Status
        |--------------------------------------------------------------------------
        */

        const invalidStatus =
            confirmedResult.bookings.find(
                (booking) =>
                    booking.status !== "confirmed"
            );

        if (invalidStatus) {

            throw new Error(
                "Status filter returned a booking with an incorrect status."
            );

        }

        console.log(
            "✅ Status filter test passed."
        );

        /*
        |--------------------------------------------------------------------------
        | 7. Test AI Voice Filter
        |--------------------------------------------------------------------------
        */

        console.log("\n6️⃣ Testing bookingSource filter...");

        const aiVoiceResult =
            await listBookings({
                bookingSource: "ai_voice",
                page: 1,
                limit: 10,
            });

        console.log({
            success: aiVoiceResult.success,
            returnedBookings:
                aiVoiceResult.bookings.length,
            total: aiVoiceResult.total,
        });

        if (!aiVoiceResult.success) {

            throw new Error(
                "Booking source filter test failed."
            );

        }

        const invalidSource =
            aiVoiceResult.bookings.find(
                (booking) =>
                    booking.bookingSource !== "ai_voice"
            );

        if (invalidSource) {

            throw new Error(
                "Booking source filter returned an incorrect booking."
            );

        }

        console.log(
            "✅ Booking source filter test passed."
        );

        /*
        |--------------------------------------------------------------------------
        | 8. Test Payment Status Filter
        |--------------------------------------------------------------------------
        */

        console.log(
            "\n7️⃣ Testing paymentStatus filter..."
        );

        const paymentResult =
            await listBookings({
                paymentStatus: "not_required",
                page: 1,
                limit: 10,
            });

        console.log({
            success: paymentResult.success,
            returnedBookings:
                paymentResult.bookings.length,
            total: paymentResult.total,
        });

        if (!paymentResult.success) {

            throw new Error(
                "Payment status filter test failed."
            );

        }

        const invalidPaymentStatus =
            paymentResult.bookings.find(
                (booking) =>
                    booking.paymentStatus !==
                    "not_required"
            );

        if (invalidPaymentStatus) {

            throw new Error(
                "Payment status filter returned an incorrect booking."
            );

        }

        console.log(
            "✅ Payment status filter test passed."
        );

        /*
        |--------------------------------------------------------------------------
        | 9. Test Invalid Date
        |--------------------------------------------------------------------------
        */

        console.log(
            "\n8️⃣ Testing invalid booking date..."
        );

        const invalidDateResult =
            await listBookings({
                bookingDate: "invalid-date",
            });

        console.log(
            invalidDateResult
        );

        if (invalidDateResult.success) {

            throw new Error(
                "Invalid date should not return success."
            );

        }

        console.log(
            "✅ Invalid date test passed."
        );

        /*
        |--------------------------------------------------------------------------
        | 10. Test Maximum Limit
        |--------------------------------------------------------------------------
        */

        console.log(
            "\n9️⃣ Testing maximum pagination limit..."
        );

        const maxLimitResult =
            await listBookings({
                page: 1,
                limit: 500,
            });

        console.log({
            success: maxLimitResult.success,
            limit: maxLimitResult.limit,
            returnedBookings:
                maxLimitResult.bookings.length,
        });

        if (
            maxLimitResult.limit > 100
        ) {

            throw new Error(
                "Maximum pagination limit was not enforced."
            );

        }

        console.log(
            "✅ Maximum limit test passed."
        );

        /*
        |--------------------------------------------------------------------------
        | Final Success
        |--------------------------------------------------------------------------
        */

        console.log("\n========================================");
        console.log(
            "🎉 ALL LIST BOOKING SERVICE TESTS PASSED"
        );
        console.log("========================================");

    } catch (error) {

        console.error(
            "\n❌ LIST BOOKING SERVICE TEST FAILED"
        );

        console.error(error);

        process.exitCode = 1;

    } finally {

        /*
        |--------------------------------------------------------------------------
        | Close MongoDB
        |--------------------------------------------------------------------------
        */

        if (mongoose.connection.readyState !== 0) {

            await mongoose.connection.close();

            console.log(
                "\n✅ MongoDB connection closed."
            );

        }

    }
};

runTest();