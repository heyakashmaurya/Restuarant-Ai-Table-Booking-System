
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
import { listBookings } from "./listBookings.js";

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

    /*
|--------------------------------------------------------------------------
| List Bookings
|--------------------------------------------------------------------------
*/

    listBookings,

};

