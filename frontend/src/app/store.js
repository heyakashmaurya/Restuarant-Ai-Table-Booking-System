
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import bookingReducer from "../features/bookingSlice";
import socketReducer from "../features/socketSlice";
import tableReducer from "../features/tableSlice";
import analyticsReducer
    from "../features/analyticsSlice.js";
    import callReducer
    from "../features/callSlice.js";


const store = configureStore({
    reducer: {
        auth: authReducer,
        booking: bookingReducer,
        socket: socketReducer,
        table: tableReducer,
        analytics: analyticsReducer,
        call: callReducer,
    },
});


export default store;

// import { configureStore } from "@reduxjs/toolkit";

// import authReducer from "../features/authSlice.js";
// import bookingReducer from "../features/bookingSlice.js";
// import tableReducer from "../features/tableSlice.js";
// import socketReducer from "../features/socketSlice.js";


// const store = configureStore({
//     reducer: {
//         auth: authReducer,

//         booking: bookingReducer,

//         table: tableReducer,

//         socket: socketReducer,
//     },

//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: true,
//         }),

//     devTools:
//         import.meta.env.MODE !==
//         "production",
// });


// export default store;