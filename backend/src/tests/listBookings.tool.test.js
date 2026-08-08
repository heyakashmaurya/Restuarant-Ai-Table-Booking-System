import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Customer from "../models/Customer.js";
import Table from "../models/Table.js";
import { listBookings } from "../tools/booking/listBookings.js";

dotenv.config();

const runTest = async () => {
    try {
        console.log("1️⃣ Connecting to MongoDB...");

        await connectDB();

        console.log("✅ MongoDB connected");

        console.log("\n2️⃣ Testing listBookings tool...");

        const result = await listBookings({
            page: 1,
            limit: 10,
        });

        console.log("\nList Bookings Tool Result:");
        console.dir(result, { depth: 5 });

        if (!result) {
            throw new Error("Tool returned no result.");
        }

        if (result.success !== true) {
            throw new Error(
                result.message || "listBookings tool failed."
            );
        }

        if (!Array.isArray(result.bookings)) {
            throw new Error(
                "Tool result bookings is not an array."
            );
        }

        if (typeof result.total !== "number") {
            throw new Error(
                "Tool result total is not a number."
            );
        }

        if (typeof result.page !== "number") {
            throw new Error(
                "Tool result page is not a number."
            );
        }

        if (typeof result.limit !== "number") {
            throw new Error(
                "Tool result limit is not a number."
            );
        }

        if (typeof result.totalPages !== "number") {
            throw new Error(
                "Tool result totalPages is not a number."
            );
        }

        console.log("\n✅ listBookings tool test passed.");

    } catch (error) {

        console.error(
            "\n❌ LIST BOOKINGS TOOL TEST FAILED"
        );

        console.error(error);

        process.exitCode = 1;

    } finally {

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();

            console.log(
                "\n✅ MongoDB connection closed."
            );
        }
    }
};

runTest();