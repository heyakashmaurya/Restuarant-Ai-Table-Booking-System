import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    connected: false,
    socketId: null,
    error: null,
};

const socketSlice = createSlice({
    name: "socket",
    initialState,

    reducers: {
        socketConnected: (state, action) => {
            state.connected = true;
            state.socketId = action.payload || null;
            state.error = null;
        },

        socketDisconnected: (state) => {
            state.connected = false;
            state.socketId = null;
        },

        socketError: (state, action) => {
            state.connected = false;
            state.error = action.payload;
        },

        setSocketStatus: (state, action) => {
            state.connected = action.payload;
        },

        clearSocketError: (state) => {
            state.error = null;
        },
    },
});

export const {
    socketConnected,
    socketDisconnected,
    socketError,
    setSocketStatus,
    clearSocketError,
} = socketSlice.actions;

export default socketSlice.reducer;