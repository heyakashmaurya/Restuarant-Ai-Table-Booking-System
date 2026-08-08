

import Booking from "../../models/Booking.js";
import Table from "../../models/Table.js";

import { validateBookingDate } from "../../utils/dateValidator.js";
import { validateBookingTime } from "../../utils/timeValidator.js";
import { calculateEndTime } from "../../utils/calculateEndTime.js";
import { isTimeOverlapping } from "../../utils/timeOverlap.js";

/*
|--------------------------------------------------------------------------
| Check Table Availability
|--------------------------------------------------------------------------
*/

export const checkAvailability = async ({
    bookingDate,
    startTime,
    guestCount,
    excludeBookingId = null,
}) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | Validate Booking Date
        |--------------------------------------------------------------------------
        */

        const dateValidation = validateBookingDate(bookingDate);

        if (!dateValidation.valid) {

            return {
                available: false,
                table: null,
                endTime: null,
                reason: dateValidation.reason,
            };

        }

        /*
        |--------------------------------------------------------------------------
        | Validate Booking Time
        |--------------------------------------------------------------------------
        */

        const timeValidation = validateBookingTime(startTime);

        if (!timeValidation.valid) {

            return {
                available: false,
                table: null,
                endTime: null,
                reason: timeValidation.reason,
            };

        }

        /*
        |--------------------------------------------------------------------------
        | Calculate Booking End Time
        |--------------------------------------------------------------------------
        */

        const endTime = calculateEndTime(startTime);

        /*
        |--------------------------------------------------------------------------
        | Find Suitable Tables
        |--------------------------------------------------------------------------
        */

        const suitableTables = await Table.find({

            isDeleted: false,

            isActive: true,

            capacity: {
                $gte: guestCount,
            },

        }).sort({

            capacity: 1,

        });

        if (!suitableTables.length) {

            return {

                available: false,

                table: null,

                endTime,

                reason: "No table can accommodate this many guests.",

            };

        }

        /*
        |--------------------------------------------------------------------------
        | Existing Active Bookings
        |--------------------------------------------------------------------------
        */

        const bookingQuery = {

            bookingDate,

            status: {
                $in: [
                    "Pending",
                    "Confirmed",
                    "Seated",
                ],
            },

            isDeleted: false,

        };

        /*
        |--------------------------------------------------------------------------
        | Ignore Current Booking (For Updates)
        |--------------------------------------------------------------------------
        */

        if (excludeBookingId) {

            bookingQuery._id = {

                $ne: excludeBookingId,

            };

        }

        const existingBookings = await Booking.find(bookingQuery);

        /*
        |--------------------------------------------------------------------------
        | Find First Available Table
        |--------------------------------------------------------------------------
        */

        for (const table of suitableTables) {

            const tableBookings = existingBookings.filter(

                booking =>

                    booking.table &&

                    booking.table.toString() === table._id.toString()

            );

            let isOccupied = false;

            for (const booking of tableBookings) {

                if (

                    isTimeOverlapping({

                        existingStart: booking.startTime,

                        existingEnd: booking.endTime,

                        requestedStart: startTime,

                        requestedEnd: endTime,

                    })

                ) {

                    isOccupied = true;

                    break;

                }

            }

            if (!isOccupied) {

                return {

                    available: true,

                    table,

                    endTime,

                    reason: null,

                };

            }

        }

        /*
        |--------------------------------------------------------------------------
        | No Table Available
        |--------------------------------------------------------------------------
        */

        return {

            available: false,

            table: null,

            endTime,

            reason: "No tables available at the selected time.",

        };

    }

    catch (error) {

        console.error(

            "Check Availability Error:",

            error

        );

        return {

            available: false,

            table: null,

            endTime: null,

            reason: "Something went wrong while checking availability.",

        };

    }

};


// import Booking from "../../models/Booking.js";
// import Table from "../../models/Table.js";

// import { validateBookingDate } from "../../utils/dateValidator.js";
// import { validateBookingTime } from "../../utils/timeValidator.js";
// import { calculateEndTime } from "../../utils/calculateEndTime.js";
// import { isTimeOverlapping } from "../../utils/timeOverlap.js";





// export const checkAvailability = async ({
//     bookingDate,
//     startTime,
//     guestCount,
// }) => {

//     try {

//         /*
//         |--------------------------------------------------------------------------
//         | Validate Booking Date
//         |--------------------------------------------------------------------------
//         */

//         const dateValidation = validateBookingDate(bookingDate);

//         if (!dateValidation.valid) {
//             return {
//                 available: false,
//                 table: null,
//                 endTime: null,
//                 reason: dateValidation.reason,
//             };
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Validate Booking Time
//         |--------------------------------------------------------------------------
//         */

//         const timeValidation = validateBookingTime(startTime);

//         if (!timeValidation.valid) {
//             return {
//                 available: false,
//                 table: null,
//                 endTime: null,
//                 reason: timeValidation.reason,
//             };
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Calculate Booking End Time
//         |--------------------------------------------------------------------------
//         */

//         const endTime = calculateEndTime(startTime);

//         /*
//         |--------------------------------------------------------------------------
//         | Find Suitable Tables
//         |--------------------------------------------------------------------------
//         */

//         const suitableTables = await Table.find({
//             isDeleted: false,
//             isActive: true,
//             capacity: {
//                 $gte: guestCount,
//             },
//         }).sort({
//             capacity: 1,
//         });

//         if (!suitableTables.length) {
//             return {
//                 available: false,
//                 table: null,
//                 endTime,
//                 reason: "No table can accommodate this many guests.",
//             };
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Existing Bookings On Same Date
//         |--------------------------------------------------------------------------
//         */

//         const existingBookings = await Booking.find({
//             bookingDate,
//             status: {
//                 $in: [
//                     "Pending",
//                     "Confirmed",
//                     "Seated",
//                 ],
//             },
//             isDeleted: false,
//         });

//         /*
//         |--------------------------------------------------------------------------
//         | Find First Available Table
//         |--------------------------------------------------------------------------
//         */

//         for (const table of suitableTables) {

//             const tableBookings = existingBookings.filter(
//                 booking =>
//                     booking.table &&
//                     booking.table.toString() === table._id.toString()
//             );

//             let isOccupied = false;

//             for (const booking of tableBookings) {

//                 if (
//                     isTimeOverlapping({
//                         existingStart: booking.startTime,
//                         existingEnd: booking.endTime,
//                         requestedStart: startTime,
//                         requestedEnd: endTime,
//                     })
//                 ) {
//                     isOccupied = true;
//                     break;
//                 }

//             }

//             if (!isOccupied) {

//                 return {
//                     available: true,
//                     table,
//                     endTime,
//                     reason: null,
//                 };

//             }

//         }

//         /*
//         |--------------------------------------------------------------------------
//         | No Tables Available
//         |--------------------------------------------------------------------------
//         */

//         return {
//             available: false,
//             table: null,
//             endTime,
//             reason: "No tables available at the selected time.",
//         };

//     } catch (error) {

//         console.error(
//             "Check Availability Error:",
//             error
//         );

//         return {
//             available: false,
//             table: null,
//             endTime: null,
//             reason: "Something went wrong.",
//         };

//     }

// };
