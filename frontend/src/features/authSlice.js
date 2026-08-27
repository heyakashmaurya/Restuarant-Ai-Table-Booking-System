

import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState = {
    user: storedUser
        ? JSON.parse(storedUser)
        : null,

    token: storedToken || null,

    isAuthenticated: !!storedToken,

    loading: false,

    error: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        loginSuccess: (state, action) => {
            state.loading = false;

            state.user = action.payload.user;

            state.token = action.payload.token;

            state.isAuthenticated = true;

            state.error = null;
        },

        loginFailure: (state, action) => {
            state.loading = false;

            state.error = action.payload;

            state.isAuthenticated = false;
        },

        logout: (state) => {
            state.user = null;

            state.token = null;

            state.isAuthenticated = false;

            state.loading = false;

            state.error = null;

            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },

        setUser: (state, action) => {
            state.user = action.payload;

            state.isAuthenticated = !!state.token;
        },

        clearAuthError: (state) => {
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    setUser,
    clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     user: null,
//     token: null,
//     isAuthenticated: false,
//     loading: false,
//     error: null,
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,

//     reducers: {
//         loginStart: (state) => {
//             state.loading = true;
//             state.error = null;
//         },

//         loginSuccess: (state, action) => {
//             state.loading = false;
//             state.user = action.payload.user;
//             state.token = action.payload.token;
//             state.isAuthenticated = true;
//             state.error = null;
//         },

//         loginFailure: (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//             state.isAuthenticated = false;
//         },

//         logout: (state) => {
//             state.user = null;
//             state.token = null;
//             state.isAuthenticated = false;
//             state.loading = false;
//             state.error = null;
//         },

//         setUser: (state, action) => {
//             state.user = action.payload;
//             state.isAuthenticated = !!action.payload;
//         },

//         clearAuthError: (state) => {
//             state.error = null;
//         },
//     },
// });

// export const {
//     loginStart,
//     loginSuccess,
//     loginFailure,
//     logout,
//     setUser,
//     clearAuthError,
// } = authSlice.actions;

// export default authSlice.reducer;