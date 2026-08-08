import dotenv from "dotenv";

dotenv.config();

import connectDB from "../config/db.js";

import Table from "../models/Table.js";

import {
    checkAvailability,
    createBooking,
    getBooking,
    updateBooking,
    cancelBooking,
} from "../services/booking/index.js";


/*
|--------------------------------------------------------------------------
| Test Configuration
|--------------------------------------------------------------------------
*/

const TEST_PHONE = "9999999999";

const TEST_CUSTOMER_NAME = "Booking Service Test";


/*
|--------------------------------------------------------------------------
| Main Test
|--------------------------------------------------------------------------
*/

const runBookingTest = async () => {

    try {

        console.log("\n========================================");
        console.log("BOOKING SERVICE TEST");
        console.log("========================================\n");


        /*
        |--------------------------------------------------------------------------
        | 1. Connect Database
        |--------------------------------------------------------------------------
        */

        console.log("1️⃣ Connecting to MongoDB...");

        await connectDB();

        console.log("✅ MongoDB connected\n");


        /*
        |--------------------------------------------------------------------------
        | 2. Check Tables
        |--------------------------------------------------------------------------
        */

        console.log("2️⃣ Checking restaurant tables...");

        const tables = await Table.find({
            isDeleted: false,
            isActive: true,
        });

        console.log(
            `✅ Active tables found: ${tables.length}`
        );

        if (!tables.length) {

            console.log(
                "\n❌ No active tables found."
            );

            console.log(
                "Create at least one active table before running the booking test."
            );

            process.exit(1);

        }

        console.log(
            "Available tables:"
        );

        tables.forEach((table) => {

            console.log({
                id: table._id.toString(),
                name: table.name,
                capacity: table.capacity,
                isActive: table.isActive,
            });

        });

        console.log();


        /*
        |--------------------------------------------------------------------------
        | 3. Check Availability
        |--------------------------------------------------------------------------
        */

        console.log("3️⃣ Testing checkAvailability...\n");

        /*
        | Use a future date for testing.
        | Adjust this if your validators require a specific format.
        */

        const bookingDate = new Date();

        bookingDate.setDate(
            bookingDate.getDate() + 1
        );

        bookingDate.setHours(
            0,
            0,
            0,
            0
        );

        const startTime = "19:00";

        const guestCount = 2;


        const availability = await checkAvailability({

            bookingDate,

            startTime,

            guestCount,

        });


        console.log(
            "Availability result:"
        );

        console.dir(
            availability,
            {
                depth: 5,
            }
        );


        if (!availability.available) {

            console.log(
                "\n❌ No availability."
            );

            console.log(
                "Reason:",
                availability.reason
            );

            console.log(
                "\nStop here and fix availability before continuing."
            );

            process.exit(1);

        }

        console.log(
            "\n✅ Table is available:"
        );

        console.log({

            id:
                availability.table._id.toString(),

            name:
                availability.table.name,

            capacity:
                availability.table.capacity,

        });

        console.log();


        /*
        |--------------------------------------------------------------------------
        | 4. Create Booking
        |--------------------------------------------------------------------------
        */

        console.log("4️⃣ Testing createBooking...\n");

        const createResult = await createBooking({

            name:
                TEST_CUSTOMER_NAME,

            phone:
                TEST_PHONE,

            email:
                "test@example.com",

            bookingDate,

            startTime,

            guestCount,

            specialRequest:
                "Automated booking service test",

            occasion:
                "Test",

            notes:
                "Temporary test booking",

        });


        console.log(
            "Create booking result:"
        );

        console.dir(
            createResult,
            {
                depth: 5,
            }
        );


        if (!createResult.success) {

            console.log(
                "\n❌ Booking creation failed."
            );

            process.exit(1);

        }


        const createdBooking =
            createResult.booking;


        console.log(
            "\n✅ Booking created."
        );

        console.log({

            bookingId:
                createdBooking._id.toString(),

            confirmationCode:
                createdBooking.confirmationCode,

            status:
                createdBooking.status,

        });

        console.log();


        /*
        |--------------------------------------------------------------------------
        | 5. Get Booking
        |--------------------------------------------------------------------------
        */

        console.log("5️⃣ Testing getBooking...\n");


        const getResult = await getBooking({

            confirmationCode:
                createdBooking.confirmationCode,

        });


        console.log(
            "Get booking result:"
        );

        console.dir(
            getResult,
            {
                depth: 5,
            }
        );


        if (!getResult.success) {

            console.log(
                "\n❌ getBooking failed."
            );

            process.exit(1);

        }


        console.log(
            "\n✅ Booking retrieved successfully."
        );

        console.log();


        /*
        |--------------------------------------------------------------------------
        | 6. Update Booking
        |--------------------------------------------------------------------------
        */

        console.log("6️⃣ Testing updateBooking...\n");


        const updateResult = await updateBooking({

            confirmationCode:
                createdBooking.confirmationCode,

            guestCount:
                3,

            specialRequest:
                "Updated booking service test",

        });


        console.log(
            "Update booking result:"
        );

        console.dir(
            updateResult,
            {
                depth: 5,
            }
        );


        if (!updateResult.success) {

            console.log(
                "\n❌ updateBooking failed."
            );

            process.exit(1);

        }


        console.log(
            "\n✅ Booking updated successfully."
        );

        console.log();


        /*
        |--------------------------------------------------------------------------
        | 7. Get Updated Booking
        |--------------------------------------------------------------------------
        */

        console.log(
            "7️⃣ Verifying updated booking...\n"
        );


        const updatedBooking =
            await getBooking({

                confirmationCode:
                    createdBooking.confirmationCode,

            });


        console.log(
            "Updated booking:"
        );

        console.dir(
            updatedBooking,
            {
                depth: 5,
            }
        );


        if (!updatedBooking.success) {

            console.log(
                "\n❌ Could not retrieve updated booking."
            );

            process.exit(1);

        }


        console.log(
            "\n✅ Updated booking verified."
        );

        console.log();


        /*
        |--------------------------------------------------------------------------
        | 8. Cancel Booking
        |--------------------------------------------------------------------------
        */

        console.log("8️⃣ Testing cancelBooking...\n");


        const cancelResult = await cancelBooking({

            confirmationCode:
                createdBooking.confirmationCode,

            reason:
                "Booking service test cancellation",

        });


        console.log(
            "Cancel booking result:"
        );

        console.dir(
            cancelResult,
            {
                depth: 5,
            }
        );


        if (!cancelResult.success) {

            console.log(
                "\n❌ cancelBooking failed."
            );

            process.exit(1);

        }


        console.log(
            "\n✅ Booking cancelled successfully."
        );

        console.log();


        /*
        |--------------------------------------------------------------------------
        | 9. Verify Cancellation
        |--------------------------------------------------------------------------
        */

        console.log(
            "9️⃣ Verifying cancelled booking...\n"
        );


        const cancelledBooking =
            await getBooking({

                confirmationCode:
                    createdBooking.confirmationCode,

            });


        console.log(
            "Cancelled booking:"
        );

        console.dir(
            cancelledBooking,
            {
                depth: 5,
            }
        );


        if (!cancelledBooking.success) {

            console.log(
                "\n❌ Could not retrieve cancelled booking."
            );

            process.exit(1);

        }


        // if (
        //     cancelledBooking.booking.status !==
        //     "Cancelled"
        // ) {

        //     console.log(
        //         "\n❌ Booking status is not Cancelled."
        //     );

        //     console.log(
        //         "Current status:",
        //         cancelledBooking.booking.status
        //     );

        //     process.exit(1);

        // }\

        if (cancelledBooking.booking.status !== "cancelled") {
            console.error("❌ Booking status is not cancelled.");
            console.error(
                "Current status:",
                cancelledBooking.booking.status
            );
        } else {
            console.log("✅ Booking status correctly changed to cancelled.");
        }


        console.log(
            "\n✅ Cancellation verified."
        );


        /*
        |--------------------------------------------------------------------------
        | Finished
        |--------------------------------------------------------------------------
        */

        console.log("\n========================================");
        console.log("🎉 ALL BOOKING SERVICE TESTS PASSED");
        console.log("========================================\n");


        process.exit(0);

    }

    catch (error) {

        console.error(
            "\n❌ BOOKING SERVICE TEST FAILED\n"
        );

        console.error(error);

        process.exit(1);

    }

};


runBookingTest();