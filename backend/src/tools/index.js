

/*
|--------------------------------------------------------------------------
| Restaurant AI Tools
|--------------------------------------------------------------------------
|
| Central registry for all AI tools.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Booking Tools
|--------------------------------------------------------------------------
*/

import { checkAvailability } from "./booking/checkAvailability.js";
import { createBooking } from "./booking/createBooking.js";
import { getBooking } from "./booking/getBooking.js";
import { listBookings } from "./booking/listBookings.js";
import { updateBooking } from "./booking/updateBooking.js";
import { cancelBooking } from "./booking/cancelBooking.js";

/*
|--------------------------------------------------------------------------
| Customer Tools
|--------------------------------------------------------------------------
*/

// Add these later when customer tools are ready.

/*
|--------------------------------------------------------------------------
| Notification Tools
|--------------------------------------------------------------------------
*/

// Add these later.

/*
|--------------------------------------------------------------------------
| Restaurant Tools
|--------------------------------------------------------------------------
*/

// Add these later.

/*
|--------------------------------------------------------------------------
| Named Exports
|--------------------------------------------------------------------------
|
| These allow other files such as livekitTools.js
| to import individual tools directly.
|
|--------------------------------------------------------------------------
*/

export {
    checkAvailability,
    createBooking,
    getBooking,
    listBookings,
    updateBooking,
    cancelBooking,
};

/*
|--------------------------------------------------------------------------
| Tool Registry
|--------------------------------------------------------------------------
*/

export const restaurantTools = [
    checkAvailability,
    createBooking,
    getBooking,
    listBookings,
    updateBooking,
    cancelBooking,
];

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default restaurantTools;



// /*
// |--------------------------------------------------------------------------
// | Restaurant AI Tools
// |--------------------------------------------------------------------------
// |
// | Central registry for all AI tools.
// |
// | The agent should import tools from this file instead of importing
// | individual tool files directly.
// |
// |--------------------------------------------------------------------------
// */

// /*
// |--------------------------------------------------------------------------
// | Booking Tools
// |--------------------------------------------------------------------------
// */

// import { checkAvailability } from "./booking/checkAvailability.js";
// import { createBooking } from "./booking/createBooking.js";
// import { getBooking } from "./booking/getBooking.js";
// import { listBookings } from "./booking/listBookings.js";
// import { updateBooking } from "./booking/updateBooking.js";
// import { cancelBooking } from "./booking/cancelBooking.js";

// /*
// |--------------------------------------------------------------------------
// | Customer Tools
// |--------------------------------------------------------------------------
// |
// | These are already present in your project.
// | We will connect/test them in the customer-tools step.
// |
// */

// // import { createCustomerTool } from "./customer/createCustomer.js";
// // import { customerHistoryTool } from "./customer/customerHistory.js";
// // import { findCustomerTool } from "./customer/findCustomer.js";
// // import { updateCustomerTool } from "./customer/updateCustomer.js";

// /*
// |--------------------------------------------------------------------------
// | Notification Tools
// |--------------------------------------------------------------------------
// */

// // import { sendConfirmationTool } from "./notification/sendConfirmation.js";
// // import { sendReminderTool } from "./notification/sendReminder.js";

// /*
// |--------------------------------------------------------------------------
// | Restaurant Tools
// |--------------------------------------------------------------------------
// */

// // import { getAvailableTablesTool } from "./restaurant/getAvailableTables.js";
// // import { getBusinessHoursTool } from "./restaurant/getBusinessHours.js";
// // import { getRestaurantInfoTool } from "./restaurant/getRestaurantInfo.js";

// /*
// |--------------------------------------------------------------------------
// | Export Tool Registry
// |--------------------------------------------------------------------------
// */

// export const restaurantTools = [
//     /*
//     |--------------------------------------------------------------------------
//     | Booking
//     |--------------------------------------------------------------------------
//     */

//     checkAvailability,
//     createBooking,
//     getBooking,
//     listBookings,
//     updateBooking,
//     cancelBooking,

//     /*
//     |--------------------------------------------------------------------------
//     | Customer
//     |--------------------------------------------------------------------------
//     */

//     // createCustomerTool,
//     // customerHistoryTool,
//     // findCustomerTool,
//     // updateCustomerTool,

//     /*
//     |--------------------------------------------------------------------------
//     | Notification
//     |--------------------------------------------------------------------------
//     */

//     // sendConfirmationTool,
//     // sendReminderTool,

//     /*
//     |--------------------------------------------------------------------------
//     | Restaurant
//     |--------------------------------------------------------------------------
//     */

//     // getAvailableTablesTool,
//     // getBusinessHoursTool,
//     // getRestaurantInfoTool,
// ];

// /*
// |--------------------------------------------------------------------------
// | Default Export
// |--------------------------------------------------------------------------
// */

// export default restaurantTools;