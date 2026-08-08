import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import { checkAvailability } from "../tools/booking/checkAvailability.js";

const runTest = async () => {
    try {
        console.log("1️⃣ Connecting to MongoDB...");

        await connectDB();

        console.log("✅ MongoDB connected");

        console.log("2️⃣ Testing checkAvailability tool...");

        const result = await checkAvailability({
            bookingDate: "2026-08-10",
            startTime: "19:00",
            guestCount: 2,
        });

        console.log("\nAvailability Tool Result:");
        console.dir(result, {
            depth: null,
        });

        if (!result.success) {
            throw new Error(
                result.message ||
                "Availability tool failed."
            );
        }

        if (typeof result.available !== "boolean") {
            throw new Error(
                "Invalid availability response."
            );
        }

        console.log("\n✅ checkAvailability tool test passed.");

        process.exit(0);

    } catch (error) {
        console.error(
            "\n❌ checkAvailability tool test failed."
        );

        console.error(error);

        process.exit(1);
    }
};

runTest();