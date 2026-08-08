
/*
|--------------------------------------------------------------------------
| Booking Service
|--------------------------------------------------------------------------
|
| High-level booking service.
|
| Individual booking operations are implemented in separate files:
|
| - checkAvailability.js
| - createBooking.js
| - findBooking.js
| - getBooking.js
| - updateBooking.js
| - cancelBooking.js
|
| This file provides a single service object when we need to work
| with multiple booking operations together.
|
|--------------------------------------------------------------------------
*/

import { checkAvailability } from "./checkAvailability.js";
import { createBooking } from "./createBooking.js";
import { findBooking } from "./findBooking.js";
import { getBooking } from "./getBooking.js";
import { updateBooking } from "./updateBooking.js";
import { cancelBooking } from "./cancelBooking.js";


/*
|--------------------------------------------------------------------------
| Booking Service
|--------------------------------------------------------------------------
*/

export const bookingService = {

    /*
    |--------------------------------------------------------------------------
    | Check Availability
    |--------------------------------------------------------------------------
    */

    checkAvailability,

    /*
    |--------------------------------------------------------------------------
    | Create Booking
    |--------------------------------------------------------------------------
    */

    createBooking,

    /*
    |--------------------------------------------------------------------------
    | Find Booking
    |--------------------------------------------------------------------------
    */

    findBooking,

    /*
    |--------------------------------------------------------------------------
    | Get Booking
    |--------------------------------------------------------------------------
    */

    getBooking,

    /*
    |--------------------------------------------------------------------------
    | Update Booking
    |--------------------------------------------------------------------------
    */

    updateBooking,

    /*
    |--------------------------------------------------------------------------
    | Cancel Booking
    |--------------------------------------------------------------------------
    */

    cancelBooking,

};












// import Booking from "../../models/Booking.js";
// import Table from "../../models/Table.js";
// import Customer from "../../models/Customer.js";

// import { validateBookingDate } from "../../utils/dateValidator.js";
// import { validateBookingTime } from "../../utils/timeValidator.js";
// import { calculateEndTime } from "../../utils/calculateEndTime.js";
// import { isTimeOverlapping } from "../../utils/timeOverlap.js";
// import { findOrCreateCustomer } from "../customer/findOrCreateCustomer.js";
// // import { checkAvailability } from "./checkAvailability.js";
// import { generateConfirmationCode } from "../../utils/generateConfirmationCode.js";

// // import { findBooking } from "./findBooking.js";
// // import { checkAvailability } from "./checkAvailability.js";

// /*
// |--------------------------------------------------------------------------
// | Check Table Availability
// |--------------------------------------------------------------------------
// */

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









// /*
// |--------------------------------------------------------------------------
// | Create Booking Service
// |--------------------------------------------------------------------------
// */

// export const createBooking = async ({
//     name,
//     phone,
//     email = "",

//     bookingDate,
//     startTime,
//     guestCount,

//     specialRequest = "",
//     occasion = "",
//     notes = "",
// }) => {

//     try {

//         /*
//         |--------------------------------------------------------------------------
//         | Basic Validation
//         |--------------------------------------------------------------------------
//         */

//         if (!name) {
//             throw new Error("Customer name is required.");
//         }

//         if (!phone) {
//             throw new Error("Customer phone is required.");
//         }

//         if (!bookingDate) {
//             throw new Error("Booking date is required.");
//         }

//         if (!startTime) {
//             throw new Error("Booking time is required.");
//         }

//         if (!guestCount) {
//             throw new Error("Guest count is required.");
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Find/Create Customer
//         |--------------------------------------------------------------------------
//         */

//         const customer = await findOrCreateCustomer({

//             name,

//             phone,

//             email,

//         });

//         /*
//         |--------------------------------------------------------------------------
//         | Check Availability
//         |--------------------------------------------------------------------------
//         */

//         const availability = await checkAvailability({

//             bookingDate,

//             startTime,

//             guestCount,

//         });

//         if (!availability.available) {

//             return {

//                 success: false,

//                 message: availability.reason,

//                 booking: null,

//             };

//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Generate Confirmation Code
//         |--------------------------------------------------------------------------
//         */

//         const confirmationCode =
//             generateConfirmationCode();

//         /*
//         |--------------------------------------------------------------------------
//         | Create Booking
//         |--------------------------------------------------------------------------
//         */

//         const booking = await Booking.create({

//             customer: customer._id,

//             table: availability.table._id,

//             bookingDate,

//             startTime,

//             guestCount,

//             confirmationCode,

//             specialRequest,

//             occasion,

//             notes,

//             status: "Confirmed",

//             bookingSource: "AI Voice",

//         });

//         /*
//         |--------------------------------------------------------------------------
//         | Populate Customer & Table
//         |--------------------------------------------------------------------------
//         */

//         await booking.populate([
//             {
//                 path: "customer",
//             },
//             {
//                 path: "table",
//             },
//         ]);

//         /*
//         |--------------------------------------------------------------------------
//         | Success
//         |--------------------------------------------------------------------------
//         */

//         return {

//             success: true,

//             booking,

//             message: "Booking created successfully.",

//         };

//     }

//     catch (error) {

//         console.error(

//             "Create Booking Error:",

//             error

//         );

//         throw error;

//     }

// };




// /*
// |--------------------------------------------------------------------------
// | Find Booking Service
// |--------------------------------------------------------------------------
// */

// export const findBooking = async ({
//     confirmationCode,
//     phone,
//     bookingId,
// }) => {

//     try {

//         /*
//         |--------------------------------------------------------------------------
//         | Search by Confirmation Code
//         |--------------------------------------------------------------------------
//         */

//         if (confirmationCode) {

//             const booking = await Booking.findOne({

//                 confirmationCode,

//                 isDeleted: false,

//             })
//                 .populate("customer")
//                 .populate("table");

//             return booking;

//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Search by Phone Number
//         |--------------------------------------------------------------------------
//         */

//         if (phone) {

//             const customer = await Customer.findOne({

//                 phone,

//                 isDeleted: false,

//             });

//             if (!customer) {

//                 return null;

//             }

//             const booking = await Booking.findOne({

//                 customer: customer._id,

//                 isDeleted: false,

//                 status: {
//                     $in: [
//                         "Pending",
//                         "Confirmed",
//                         "Seated",
//                     ],
//                 },

//             })
//                 .sort({
//                     bookingDate: 1,
//                     createdAt: -1,
//                 })
//                 .populate("customer")
//                 .populate("table");

//             return booking;

//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Search by Booking ID
//         |--------------------------------------------------------------------------
//         */

//         if (bookingId) {

//             const booking = await Booking.findOne({

//                 _id: bookingId,

//                 isDeleted: false,

//             })
//                 .populate("customer")
//                 .populate("table");

//             return booking;

//         }

//         return null;

//     }

//     catch (error) {

//         console.error(
//             "Find Booking Error:",
//             error
//         );

//         throw error;

//     }

// };





// /*
// |--------------------------------------------------------------------------
// | Update Booking
// |--------------------------------------------------------------------------
// */

// export const updateBooking = async ({

//     bookingId,

//     confirmationCode,

//     phone,

//     bookingDate,

//     startTime,

//     guestCount,

//     specialRequest,

//     occasion,

//     notes,

//     status,

// }) => {

//     try {

//         /*
//         |--------------------------------------------------------------------------
//         | Find Existing Booking
//         |--------------------------------------------------------------------------
//         */

//         const booking = await findBooking({

//             bookingId,

//             confirmationCode,

//             phone,

//         });

//         if (!booking) {

//             return {

//                 success: false,

//                 message: "Booking not found.",

//             };

//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Determine Updated Values
//         |--------------------------------------------------------------------------
//         */

//         const newDate =
//             bookingDate || booking.bookingDate;

//         const newTime =
//             startTime || booking.startTime;

//         const newGuests =
//             guestCount || booking.guestCount;

//         /*
//         |--------------------------------------------------------------------------
//         | Check Availability
//         |--------------------------------------------------------------------------
//         */

//         const changed =

//             newDate.toString() !== booking.bookingDate.toString()

//             ||

//             newTime !== booking.startTime

//             ||

//             newGuests !== booking.guestCount;

//         if (changed) {

//             const availability = await checkAvailability({

//                 bookingDate: newDate,

//                 startTime: newTime,

//                 guestCount: newGuests,

//             });

//             if (!availability.available) {

//                 return {

//                     success: false,

//                     message: availability.reason,

//                 };

//             }

//             booking.table = availability.table._id;

//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Update Fields
//         |--------------------------------------------------------------------------
//         */

//         booking.bookingDate = newDate;

//         booking.startTime = newTime;

//         booking.guestCount = newGuests;

//         if (specialRequest !== undefined) {

//             booking.specialRequest = specialRequest;

//         }

//         if (occasion !== undefined) {

//             booking.occasion = occasion;

//         }

//         if (notes !== undefined) {

//             booking.notes = notes;

//         }

//         if (status !== undefined) {

//             booking.status = status;

//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Save
//         |--------------------------------------------------------------------------
//         */

//         await booking.save();

//         await booking.populate([

//             {

//                 path: "customer",

//             },

//             {

//                 path: "table",

//             },

//         ]);

//         /*
//         |--------------------------------------------------------------------------
//         | Success
//         |--------------------------------------------------------------------------
//         */

//         return {

//             success: true,

//             booking,

//             message: "Booking updated successfully.",

//         };

//     }

//     catch (error) {

//         console.error(

//             "Update Booking Error:",

//             error

//         );

//         throw error;

//     }

// };


// // import Booking from "../../models/Booking.js";
// import Table from "../../models/Table.js";

// import { validateBookingDate } from "../../utils/dateValidator.js";
// import { validateBookingTime } from "../../utils/timeValidator.js";

// /*
// |--------------------------------------------------------------------------
// | Check Table Availability
// |--------------------------------------------------------------------------
// */

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
//                 reason: timeValidation.reason,
//             };
//         }

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
//                 reason: "No table can accommodate this many guests.",
//             };
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Find Existing Bookings
//         |--------------------------------------------------------------------------
//         */

//         const existingBookings = await Booking.find({
//             bookingDate,
//             startTime,

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
//         | Occupied Tables
//         |--------------------------------------------------------------------------
//         */

//         const occupiedTableIds = existingBookings
//             .filter((booking) => booking.table)
//             .map((booking) => booking.table.toString());

//         /*
//         |--------------------------------------------------------------------------
//         | Find First Available Table
//         |--------------------------------------------------------------------------
//         */

//         const availableTable = suitableTables.find(
//             (table) =>
//                 !occupiedTableIds.includes(
//                     table._id.toString()
//                 )
//         );

//         if (!availableTable) {
//             return {
//                 available: false,
//                 table: null,
//                 reason:
//                     "No tables available at the selected time.",
//             };
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Success
//         |--------------------------------------------------------------------------
//         */

//         return {
//             available: true,
//             table: availableTable,
//             reason: null,
//         };

//     } catch (error) {

//         console.error(
//             "Check Availability Error:",
//             error
//         );

//         return {
//             available: false,
//             table: null,
//             reason: "Something went wrong.",
//         };

//     }
// };