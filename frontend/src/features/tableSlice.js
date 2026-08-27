


import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import {
    getTables,
    getTable,
    createTable as createTableApi,
    updateTable as updateTableApi,
    updateTableStatus as updateTableStatusApi,
    deleteTable as deleteTableApi,
} from "../services/tableApi.js";


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    tables: [],

    selectedTable: null,

    loading: false,

    error: null,

    creating: false,
    createError: null,

    updating: false,
    updateError: null,

    deleting: false,
    deleteError: null,

    statusUpdating: false,
    statusUpdateError: null,
};


/*
|--------------------------------------------------------------------------
| Fetch Tables
|--------------------------------------------------------------------------
*/

export const fetchTables = createAsyncThunk(
    "table/fetchTables",

    async (
        filters = {},
        { rejectWithValue }
    ) => {

        try {

            const response =
                await getTables(filters);

            return response;

        } catch (error) {

            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to fetch tables."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Fetch Single Table
|--------------------------------------------------------------------------
*/

export const fetchTable = createAsyncThunk(
    "table/fetchTable",

    async (
        tableId,
        { rejectWithValue }
    ) => {

        try {

            if (!tableId) {
                return rejectWithValue(
                    "Table ID is required."
                );
            }

            const response =
                await getTable(tableId);

            return response;

        } catch (error) {

            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to fetch table."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Create Table
|--------------------------------------------------------------------------
*/

export const createTable = createAsyncThunk(
    "table/createTable",

    async (
        tableData,
        { rejectWithValue }
    ) => {

        try {

            const response =
                await createTableApi(
                    tableData
                );

            return response;

        } catch (error) {

            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to create table."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Update Table
|--------------------------------------------------------------------------
*/

export const updateTable = createAsyncThunk(
    "table/updateTable",

    async (
        {
            tableId,
            updates,
        },
        { rejectWithValue }
    ) => {

        try {

            if (!tableId) {
                return rejectWithValue(
                    "Table ID is required."
                );
            }

            const response =
                await updateTableApi(
                    tableId,
                    updates
                );

            return response;

        } catch (error) {

            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to update table."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Update Table Status
|--------------------------------------------------------------------------
*/

export const updateTableStatus =
    createAsyncThunk(
        "table/updateTableStatus",

        async (
            {
                tableId,
                status,
            },
            { rejectWithValue }
        ) => {

            try {

                if (!tableId) {
                    return rejectWithValue(
                        "Table ID is required."
                    );
                }

                if (!status) {
                    return rejectWithValue(
                        "Table status is required."
                    );
                }

                const response =
                    await updateTableStatusApi(
                        tableId,
                        status
                    );

                return response;

            } catch (error) {

                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to update table status."
                );
            }
        }
    );


/*
|--------------------------------------------------------------------------
| Delete Table
|--------------------------------------------------------------------------
*/

export const deleteTable = createAsyncThunk(
    "table/deleteTable",

    async (
        tableId,
        { rejectWithValue }
    ) => {

        try {

            if (!tableId) {
                return rejectWithValue(
                    "Table ID is required."
                );
            }

            const response =
                await deleteTableApi(
                    tableId
                );

            return {
                tableId,
                response,
            };

        } catch (error) {

            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to delete table."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const tableSlice = createSlice({

    name: "table",

    initialState,

    reducers: {

        /*
        |----------------------------------------------------------------------
        | Set Tables
        |----------------------------------------------------------------------
        */

        setTables: (
            state,
            action
        ) => {

            state.tables =
                action.payload || [];
        },


        /*
        |----------------------------------------------------------------------
        | Add Table Locally
        |----------------------------------------------------------------------
        */

        addTableLocal: (
            state,
            action
        ) => {

            if (action.payload) {

                state.tables.push(
                    action.payload
                );
            }
        },


        /*
        |----------------------------------------------------------------------
        | Update Table Locally
        |----------------------------------------------------------------------
        */

        updateTableLocal: (
            state,
            action
        ) => {

            const updatedTable =
                action.payload;

            if (!updatedTable?._id) {
                return;
            }

            const index =
                state.tables.findIndex(
                    (table) =>
                        table._id ===
                        updatedTable._id
                );

            if (index !== -1) {

                state.tables[index] =
                    updatedTable;
            }
        },


        /*
        |----------------------------------------------------------------------
        | Remove Table Locally
        |----------------------------------------------------------------------
        */

        removeTableLocal: (
            state,
            action
        ) => {

            state.tables =
                state.tables.filter(
                    (table) =>
                        table._id !==
                        action.payload
                );
        },


        /*
        |----------------------------------------------------------------------
        | Selected Table
        |----------------------------------------------------------------------
        */

        setSelectedTable: (
            state,
            action
        ) => {

            state.selectedTable =
                action.payload;
        },


        clearSelectedTable: (
            state
        ) => {

            state.selectedTable =
                null;
        },


        /*
        |----------------------------------------------------------------------
        | Loading
        |----------------------------------------------------------------------
        */

        setTableLoading: (
            state,
            action
        ) => {

            state.loading =
                action.payload;
        },


        /*
        |----------------------------------------------------------------------
        | Error
        |----------------------------------------------------------------------
        */

        setTableError: (
            state,
            action
        ) => {

            state.error =
                action.payload;
        },


        clearTableError: (
            state
        ) => {

            state.error = null;
        },


        /*
        |----------------------------------------------------------------------
        | Clear Tables
        |----------------------------------------------------------------------
        */

        clearTables: (
            state
        ) => {

            state.tables = [];

            state.selectedTable =
                null;
        },


        /*
        |----------------------------------------------------------------------
        | Clear Create Error
        |----------------------------------------------------------------------
        */

        clearCreateError: (
            state
        ) => {

            state.createError =
                null;
        },


        /*
        |----------------------------------------------------------------------
        | Clear Update Error
        |----------------------------------------------------------------------
        */

        clearUpdateError: (
            state
        ) => {

            state.updateError =
                null;
        },


        /*
        |----------------------------------------------------------------------
        | Clear Delete Error
        |----------------------------------------------------------------------
        */

        clearDeleteError: (
            state
        ) => {

            state.deleteError =
                null;
        },


        /*
        |----------------------------------------------------------------------
        | Clear Status Update Error
        |----------------------------------------------------------------------
        */

        clearStatusUpdateError: (
            state
        ) => {

            state.statusUpdateError =
                null;
        },
    },


    /*
    |--------------------------------------------------------------------------
    | Async Reducers
    |--------------------------------------------------------------------------
    */

    extraReducers: (builder) => {

        builder


            /*
            |------------------------------------------------------------------
            | Fetch Tables
            |------------------------------------------------------------------
            */

            .addCase(
                fetchTables.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                fetchTables.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.error = null;

                    state.tables =
                        action.payload?.data ||
                        action.payload ||
                        [];
                }
            )

            .addCase(
                fetchTables.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Unable to fetch tables.";
                }
            )


            /*
            |------------------------------------------------------------------
            | Fetch Single Table
            |------------------------------------------------------------------
            */

            .addCase(
                fetchTable.fulfilled,
                (state, action) => {

                    const table =
                        action.payload?.data ||
                        action.payload;

                    state.selectedTable =
                        table || null;
                }
            )


            /*
            |------------------------------------------------------------------
            | Create Table - Pending
            |------------------------------------------------------------------
            */

            .addCase(
                createTable.pending,
                (state) => {

                    state.creating = true;

                    state.createError =
                        null;
                }
            )


            /*
            |------------------------------------------------------------------
            | Create Table - Fulfilled
            |------------------------------------------------------------------
            */

            .addCase(
                createTable.fulfilled,
                (state, action) => {

                    state.creating = false;

                    state.createError =
                        null;

                    const newTable =
                        action.payload?.data ||
                        action.payload;

                    if (!newTable?._id) {
                        return;
                    }

                    state.tables.push(
                        newTable
                    );
                }
            )


            /*
            |------------------------------------------------------------------
            | Create Table - Rejected
            |------------------------------------------------------------------
            */

            .addCase(
                createTable.rejected,
                (state, action) => {

                    state.creating = false;

                    state.createError =
                        action.payload ||
                        "Unable to create table.";
                }
            )


            /*
            |------------------------------------------------------------------
            | Update Table - Pending
            |------------------------------------------------------------------
            */

            .addCase(
                updateTable.pending,
                (state) => {

                    state.updating = true;

                    state.updateError =
                        null;
                }
            )


            /*
            |------------------------------------------------------------------
            | Update Table - Fulfilled
            |------------------------------------------------------------------
            */

            .addCase(
                updateTable.fulfilled,
                (state, action) => {

                    state.updating = false;

                    state.updateError =
                        null;

                    const updatedTable =
                        action.payload?.data ||
                        action.payload;

                    if (!updatedTable?._id) {
                        return;
                    }

                    const index =
                        state.tables.findIndex(
                            (table) =>
                                table._id ===
                                updatedTable._id
                        );

                    if (index !== -1) {

                        state.tables[index] =
                            updatedTable;
                    }

                    if (
                        state.selectedTable?._id ===
                        updatedTable._id
                    ) {

                        state.selectedTable =
                            updatedTable;
                    }
                }
            )


            /*
            |------------------------------------------------------------------
            | Update Table - Rejected
            |------------------------------------------------------------------
            */

            .addCase(
                updateTable.rejected,
                (state, action) => {

                    state.updating = false;

                    state.updateError =
                        action.payload ||
                        "Unable to update table.";
                }
            )


            /*
            |------------------------------------------------------------------
            | Delete Table - Pending
            |------------------------------------------------------------------
            */

            .addCase(
                deleteTable.pending,
                (state) => {

                    state.deleting = true;

                    state.deleteError =
                        null;
                }
            )


            /*
            |------------------------------------------------------------------
            | Delete Table - Fulfilled
            |------------------------------------------------------------------
            */

            .addCase(
                deleteTable.fulfilled,
                (state, action) => {

                    state.deleting = false;

                    state.deleteError =
                        null;

                    const tableId =
                        action.payload?.tableId;

                    state.tables =
                        state.tables.filter(
                            (table) =>
                                table._id !==
                                tableId
                        );

                    if (
                        state.selectedTable?._id ===
                        tableId
                    ) {

                        state.selectedTable =
                            null;
                    }
                }
            )


            /*
            |------------------------------------------------------------------
            | Delete Table - Rejected
            |------------------------------------------------------------------
            */

            .addCase(
                deleteTable.rejected,
                (state, action) => {

                    state.deleting = false;

                    state.deleteError =
                        action.payload ||
                        "Unable to delete table.";
                }
            )


            /*
            |------------------------------------------------------------------
            | Update Status - Pending
            |------------------------------------------------------------------
            */

            .addCase(
                updateTableStatus.pending,
                (state) => {

                    state.statusUpdating =
                        true;

                    state.statusUpdateError =
                        null;
                }
            )


            /*
            |------------------------------------------------------------------
            | Update Status - Fulfilled
            |------------------------------------------------------------------
            */

            .addCase(
                updateTableStatus.fulfilled,
                (state, action) => {

                    state.statusUpdating =
                        false;

                    state.statusUpdateError =
                        null;

                    const updatedTable =
                        action.payload?.data ||
                        action.payload;

                    if (!updatedTable?._id) {
                        return;
                    }

                    const index =
                        state.tables.findIndex(
                            (table) =>
                                table._id ===
                                updatedTable._id
                        );

                    if (index !== -1) {

                        state.tables[index] =
                            updatedTable;
                    }

                    if (
                        state.selectedTable?._id ===
                        updatedTable._id
                    ) {

                        state.selectedTable =
                            updatedTable;
                    }
                }
            )


            /*
            |------------------------------------------------------------------
            | Update Status - Rejected
            |------------------------------------------------------------------
            */

            .addCase(
                updateTableStatus.rejected,
                (state, action) => {

                    state.statusUpdating =
                        false;

                    state.statusUpdateError =
                        action.payload ||
                        "Unable to update table status.";
                }
            );
    },
});


/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const {
    setTables,

    addTableLocal,
    updateTableLocal,
    removeTableLocal,

    setSelectedTable,
    clearSelectedTable,

    setTableLoading,
    setTableError,
    clearTableError,

    clearTables,

    clearCreateError,
    clearUpdateError,
    clearDeleteError,
    clearStatusUpdateError,

} = tableSlice.actions;


/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectTables = (state) =>
    state.table.tables || [];


export const selectTableLoading = (state) =>
    state.table.loading;


export const selectTableError = (state) =>
    state.table.error;


export const selectSelectedTable = (state) =>
    state.table.selectedTable;


export const selectCreating = (state) =>
    state.table.creating;


export const selectCreateError = (state) =>
    state.table.createError;


export const selectUpdating = (state) =>
    state.table.updating;


export const selectUpdateError = (state) =>
    state.table.updateError;


export const selectDeleting = (state) =>
    state.table.deleting;


export const selectDeleteError = (state) =>
    state.table.deleteError;


export const selectStatusUpdating = (state) =>
    state.table.statusUpdating;


export const selectStatusUpdateError = (state) =>
    state.table.statusUpdateError;


export default tableSlice.reducer;






// import {
//     createSlice,
//     createAsyncThunk,
// } from "@reduxjs/toolkit";

// import {
//     getTables,
//     updateTableStatus as updateTableStatusApi,
// } from "../services/tableApi.js";


// /*
// |--------------------------------------------------------------------------
// | Initial State
// |--------------------------------------------------------------------------
// */

// const initialState = {
//     tables: [],
//     selectedTable: null,

//     loading: false,
//     error: null,

//     statusUpdating: false,
//     statusUpdateError: null,
// };


// /*
// |--------------------------------------------------------------------------
// | Fetch Tables
// |--------------------------------------------------------------------------
// |
// | GET /api/tables
// |
// */

// export const fetchTables = createAsyncThunk(
//     "table/fetchTables",

//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await getTables();

//             return response;

//         } catch (error) {
//             return rejectWithValue(
//                 error?.response?.data?.message ||
//                 error?.message ||
//                 "Unable to fetch tables."
//             );
//         }
//     }
// );


// /*
// |--------------------------------------------------------------------------
// | Update Table Status
// |--------------------------------------------------------------------------
// |
// | PATCH /api/tables/:id/status
// |
// | Example:
// |
// | dispatch(
// |     updateTableStatus({
// |         tableId: "64abc...",
// |         status: "occupied",
// |     })
// | );
// |
// */

// export const updateTableStatus = createAsyncThunk(
//     "table/updateTableStatus",

//     async (
//         {
//             tableId,
//             status,
//         },
//         { rejectWithValue }
//     ) => {

//         try {

//             if (!tableId) {
//                 return rejectWithValue(
//                     "Table ID is required."
//                 );
//             }

//             if (!status) {
//                 return rejectWithValue(
//                     "Table status is required."
//                 );
//             }

//             const response =
//                 await updateTableStatusApi(
//                     tableId,
//                     status
//                 );

//             return response;

//         } catch (error) {

//             return rejectWithValue(
//                 error?.response?.data?.message ||
//                 error?.message ||
//                 "Unable to update table status."
//             );
//         }
//     }
// );


// /*
// |--------------------------------------------------------------------------
// | Slice
// |--------------------------------------------------------------------------
// */

// const tableSlice = createSlice({

//     name: "table",

//     initialState,

//     reducers: {

//         /*
//         |------------------------------------------------------------------
//         | Set Tables
//         |------------------------------------------------------------------
//         */

//         setTables: (state, action) => {

//             state.tables =
//                 action.payload || [];
//         },


//         /*
//         |------------------------------------------------------------------
//         | Add Table
//         |------------------------------------------------------------------
//         */

//         addTable: (state, action) => {

//             state.tables.push(
//                 action.payload
//             );
//         },


//         /*
//         |------------------------------------------------------------------
//         | Update Table
//         |------------------------------------------------------------------
//         */

//         updateTable: (state, action) => {

//             const updatedTable =
//                 action.payload;

//             const index =
//                 state.tables.findIndex(
//                     (table) =>
//                         table._id ===
//                         updatedTable._id
//                 );

//             if (index !== -1) {

//                 state.tables[index] =
//                     updatedTable;
//             }
//         },


//         /*
//         |------------------------------------------------------------------
//         | Remove Table
//         |------------------------------------------------------------------
//         */

//         removeTable: (state, action) => {

//             state.tables =
//                 state.tables.filter(
//                     (table) =>
//                         table._id !==
//                         action.payload
//                 );
//         },


//         /*
//         |------------------------------------------------------------------
//         | Selected Table
//         |------------------------------------------------------------------
//         */

//         setSelectedTable: (
//             state,
//             action
//         ) => {

//             state.selectedTable =
//                 action.payload;
//         },


//         clearSelectedTable: (
//             state
//         ) => {

//             state.selectedTable =
//                 null;
//         },


//         /*
//         |------------------------------------------------------------------
//         | Loading
//         |------------------------------------------------------------------
//         */

//         setTableLoading: (
//             state,
//             action
//         ) => {

//             state.loading =
//                 action.payload;
//         },


//         /*
//         |------------------------------------------------------------------
//         | Error
//         |------------------------------------------------------------------
//         */

//         setTableError: (
//             state,
//             action
//         ) => {

//             state.error =
//                 action.payload;
//         },


//         clearTableError: (
//             state
//         ) => {

//             state.error = null;
//         },


//         /*
//         |------------------------------------------------------------------
//         | Clear Tables
//         |------------------------------------------------------------------
//         */

//         clearTables: (state) => {

//             state.tables = [];

//             state.selectedTable =
//                 null;
//         },


//         /*
//         |------------------------------------------------------------------
//         | Clear Status Update Error
//         |------------------------------------------------------------------
//         */

//         clearStatusUpdateError: (
//             state
//         ) => {

//             state.statusUpdateError =
//                 null;
//         },
//     },


//     /*
//     |--------------------------------------------------------------------------
//     | Async Thunks
//     |--------------------------------------------------------------------------
//     */

//     extraReducers: (builder) => {

//         builder


//             /*
//             |----------------------------------------------------------------
//             | Fetch Tables - Pending
//             |----------------------------------------------------------------
//             */

//             .addCase(
//                 fetchTables.pending,
//                 (state) => {

//                     state.loading = true;

//                     state.error = null;
//                 }
//             )


//             /*
//             |----------------------------------------------------------------
//             | Fetch Tables - Fulfilled
//             |----------------------------------------------------------------
//             */

//             .addCase(
//                 fetchTables.fulfilled,
//                 (state, action) => {

//                     state.loading = false;

//                     state.error = null;

//                     /*
//                      * Expected API response:
//                      *
//                      * {
//                      *     success: true,
//                      *     count: 10,
//                      *     data: [...]
//                      * }
//                      */

//                     state.tables =
//                         action.payload?.data ||
//                         action.payload ||
//                         [];
//                 }
//             )


//             /*
//             |----------------------------------------------------------------
//             | Fetch Tables - Rejected
//             |----------------------------------------------------------------
//             */

//             .addCase(
//                 fetchTables.rejected,
//                 (state, action) => {

//                     state.loading = false;

//                     state.error =
//                         action.payload ||
//                         "Unable to fetch tables.";
//                 }
//             )


//             /*
//             |----------------------------------------------------------------
//             | Update Table Status - Pending
//             |----------------------------------------------------------------
//             */

//             .addCase(
//                 updateTableStatus.pending,
//                 (state) => {

//                     state.statusUpdating = true;

//                     state.statusUpdateError =
//                         null;
//                 }
//             )


//             /*
//             |----------------------------------------------------------------
//             | Update Table Status - Fulfilled
//             |----------------------------------------------------------------
//             */

//             .addCase(
//                 updateTableStatus.fulfilled,
//                 (state, action) => {

//                     state.statusUpdating = false;

//                     state.statusUpdateError =
//                         null;

//                     /*
//                      * Expected API response:
//                      *
//                      * {
//                      *     success: true,
//                      *     message: "...",
//                      *     data: table
//                      * }
//                      */

//                     const updatedTable =
//                         action.payload?.data ||
//                         action.payload;

//                     if (!updatedTable?._id) {
//                         return;
//                     }


//                     /*
//                      * Update table in Redux
//                      */

//                     const index =
//                         state.tables.findIndex(
//                             (table) =>
//                                 table._id ===
//                                 updatedTable._id
//                         );

//                     if (index !== -1) {

//                         state.tables[index] =
//                             updatedTable;
//                     }


//                     /*
//                      * Update selected table
//                      * if it is the same table.
//                      */

//                     if (
//                         state.selectedTable?._id ===
//                         updatedTable._id
//                     ) {

//                         state.selectedTable =
//                             updatedTable;
//                     }
//                 }
//             )


//             /*
//             |----------------------------------------------------------------
//             | Update Table Status - Rejected
//             |----------------------------------------------------------------
//             */

//             .addCase(
//                 updateTableStatus.rejected,
//                 (state, action) => {

//                     state.statusUpdating = false;

//                     state.statusUpdateError =
//                         action.payload ||
//                         "Unable to update table status.";
//                 }
//             );
//     },
// });


// /*
// |--------------------------------------------------------------------------
// | Actions
// |--------------------------------------------------------------------------
// */

// export const {
//     setTables,
//     addTable,
//     updateTable,
//     removeTable,

//     setSelectedTable,
//     clearSelectedTable,

//     setTableLoading,
//     setTableError,
//     clearTableError,

//     clearTables,

//     clearStatusUpdateError,

// } = tableSlice.actions;


// /*
// |--------------------------------------------------------------------------
// | Selectors
// |--------------------------------------------------------------------------
// */

// export const selectTables = (state) =>
//     state.table.tables;


// export const selectTableLoading = (state) =>
//     state.table.loading;


// export const selectTableError = (state) =>
//     state.table.error;


// export const selectSelectedTable = (state) =>
//     state.table.selectedTable;


// export const selectStatusUpdating = (state) =>
//     state.table.statusUpdating;


// export const selectStatusUpdateError = (state) =>
//     state.table.statusUpdateError;


// /*
// |--------------------------------------------------------------------------
// | Export Reducer
// |--------------------------------------------------------------------------
// */

// export default tableSlice.reducer;



// import {
//     createSlice,
//     createAsyncThunk,
// } from "@reduxjs/toolkit";

// import {
//     getTables,
// } from "../services/tableApi.js";

// /*
// |--------------------------------------------------------------------------
// | Initial State
// |--------------------------------------------------------------------------
// */

// const initialState = {
//     tables: [],
//     selectedTable: null,

//     loading: false,
//     error: null,
// };

// /*
// |--------------------------------------------------------------------------
// | Fetch Tables
// |--------------------------------------------------------------------------
// |
// | GET /api/tables
// |
// */

// export const fetchTables = createAsyncThunk(
//     "table/fetchTables",

//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await getTables();

//             return response;
//         } catch (error) {
//             return rejectWithValue(
//                 error?.response?.data?.message ||
//                 error?.message ||
//                 "Unable to fetch tables."
//             );
//         }
//     }
// );

// /*
// |--------------------------------------------------------------------------
// | Table Slice
// |--------------------------------------------------------------------------
// */

// const tableSlice = createSlice({
//     name: "table",

//     initialState,

//     reducers: {
//         /*
//         |--------------------------------------------------------------------------
//         | Set Tables
//         |--------------------------------------------------------------------------
//         */

//         setTables: (state, action) => {
//             state.tables =
//                 Array.isArray(action.payload)
//                     ? action.payload
//                     : [];
//         },

//         /*
//         |--------------------------------------------------------------------------
//         | Add Table
//         |--------------------------------------------------------------------------
//         */

//         addTable: (state, action) => {
//             if (action.payload) {
//                 state.tables.push(action.payload);
//             }
//         },

//         /*
//         |--------------------------------------------------------------------------
//         | Update Table
//         |--------------------------------------------------------------------------
//         */

//         updateTable: (state, action) => {
//             const updatedTable =
//                 action.payload;

//             if (!updatedTable?._id) {
//                 return;
//             }

//             const index =
//                 state.tables.findIndex(
//                     (table) =>
//                         table?._id ===
//                         updatedTable._id
//                 );

//             if (index !== -1) {
//                 state.tables[index] =
//                     updatedTable;
//             }
//         },

//         /*
//         |--------------------------------------------------------------------------
//         | Remove Table
//         |--------------------------------------------------------------------------
//         */

//         removeTable: (state, action) => {
//             const tableId =
//                 action.payload;

//             if (!tableId) {
//                 return;
//             }

//             state.tables =
//                 state.tables.filter(
//                     (table) =>
//                         table?._id !== tableId
//                 );

//             /*
//              * Clear selected table if the
//              * deleted table was selected.
//              */

//             if (
//                 state.selectedTable?._id ===
//                 tableId
//             ) {
//                 state.selectedTable = null;
//             }
//         },

//         /*
//         |--------------------------------------------------------------------------
//         | Set Selected Table
//         |--------------------------------------------------------------------------
//         */

//         setSelectedTable: (state, action) => {
//             state.selectedTable =
//                 action.payload || null;
//         },

//         /*
//         |--------------------------------------------------------------------------
//         | Clear Selected Table
//         |--------------------------------------------------------------------------
//         */

//         clearSelectedTable: (state) => {
//             state.selectedTable = null;
//         },

//         /*
//         |--------------------------------------------------------------------------
//         | Manual Loading State
//         |--------------------------------------------------------------------------
//         */

//         setTableLoading: (state, action) => {
//             state.loading =
//                 Boolean(action.payload);
//         },

//         /*
//         |--------------------------------------------------------------------------
//         | Manual Error State
//         |--------------------------------------------------------------------------
//         */

//         setTableError: (state, action) => {
//             state.error =
//                 action.payload || null;
//         },

//         /*
//         |--------------------------------------------------------------------------
//         | Clear Error
//         |--------------------------------------------------------------------------
//         */

//         clearTableError: (state) => {
//             state.error = null;
//         },

//         /*
//         |--------------------------------------------------------------------------
//         | Clear Tables
//         |--------------------------------------------------------------------------
//         */

//         clearTables: (state) => {
//             state.tables = [];
//             state.selectedTable = null;
//         },
//     },

//     /*
//     |--------------------------------------------------------------------------
//     | Async Thunk Reducers
//     |--------------------------------------------------------------------------
//     */

//     extraReducers: (builder) => {
//         builder

//             /*
//             |--------------------------------------------------------------------------
//             | Fetch Pending
//             |--------------------------------------------------------------------------
//             */

//             .addCase(
//                 fetchTables.pending,
//                 (state) => {
//                     state.loading = true;
//                     state.error = null;
//                 }
//             )

//             /*
//             |--------------------------------------------------------------------------
//             | Fetch Fulfilled
//             |--------------------------------------------------------------------------
//             */

//             .addCase(
//                 fetchTables.fulfilled,
//                 (state, action) => {
//                     state.loading = false;
//                     state.error = null;

//                     /*
//                      * Expected API response:
//                      *
//                      * {
//                      *     success: true,
//                      *     count: 10,
//                      *     data: [...]
//                      * }
//                      *
//                      * Therefore:
//                      *
//                      * action.payload.data
//                      */

//                     const tables =
//                         action.payload?.data;

//                     state.tables =
//                         Array.isArray(tables)
//                             ? tables
//                             : Array.isArray(
//                                 action.payload
//                             )
//                                 ? action.payload
//                                 : [];
//                 }
//             )

//             /*
//             |--------------------------------------------------------------------------
//             | Fetch Rejected
//             |--------------------------------------------------------------------------
//             */

//             .addCase(
//                 fetchTables.rejected,
//                 (state, action) => {
//                     state.loading = false;

//                     state.error =
//                         action.payload ||
//                         "Unable to fetch tables.";
//                 }
//             );
//     },
// });

// /*
// |--------------------------------------------------------------------------
// | Actions
// |--------------------------------------------------------------------------
// */

// export const {
//     setTables,
//     addTable,
//     updateTable,
//     removeTable,
//     setSelectedTable,
//     clearSelectedTable,
//     setTableLoading,
//     setTableError,
//     clearTableError,
//     clearTables,
// } = tableSlice.actions;

// /*
// |--------------------------------------------------------------------------
// | Selectors
// |--------------------------------------------------------------------------
// */

// export const selectTables = (state) =>
//     state.table?.tables || [];

// export const selectTableLoading = (state) =>
//     state.table?.loading || false;

// export const selectTableError = (state) =>
//     state.table?.error || null;

// export const selectSelectedTable = (state) =>
//     state.table?.selectedTable || null;

// /*
// |--------------------------------------------------------------------------
// | Default Export
// |--------------------------------------------------------------------------
// */

// export default tableSlice.reducer;













// import {
//     createSlice,
//     createAsyncThunk,
// } from "@reduxjs/toolkit";

// import {
//     getTables,
// } from "../services/tableApi.js";

// const initialState = {
//     tables: [],
//     selectedTable: null,

//     loading: false,
//     error: null,
// };

// /*
// |--------------------------------------------------------------------------
// | Fetch Tables
// |--------------------------------------------------------------------------
// */

// export const fetchTables = createAsyncThunk(
//     "table/fetchTables",

//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await getTables();

//             return response;
//         } catch (error) {
//             return rejectWithValue(
//                 error?.response?.data?.message ||
//                 error?.message ||
//                 "Unable to fetch tables."
//             );
//         }
//     }
// );

// /*
// |--------------------------------------------------------------------------
// | Slice
// |--------------------------------------------------------------------------
// */

// const tableSlice = createSlice({
//     name: "table",

//     initialState,

//     reducers: {
//         setTables: (state, action) => {
//             state.tables = action.payload || [];
//         },

//         addTable: (state, action) => {
//             state.tables.push(action.payload);
//         },

//         updateTable: (state, action) => {
//             const index = state.tables.findIndex(
//                 (table) =>
//                     table._id === action.payload._id
//             );

//             if (index !== -1) {
//                 state.tables[index] =
//                     action.payload;
//             }
//         },

//         removeTable: (state, action) => {
//             state.tables =
//                 state.tables.filter(
//                     (table) =>
//                         table._id !== action.payload
//                 );
//         },

//         setSelectedTable: (state, action) => {
//             state.selectedTable =
//                 action.payload;
//         },

//         clearSelectedTable: (state) => {
//             state.selectedTable = null;
//         },

//         setTableLoading: (state, action) => {
//             state.loading = action.payload;
//         },

//         setTableError: (state, action) => {
//             state.error = action.payload;
//         },

//         clearTableError: (state) => {
//             state.error = null;
//         },

//         clearTables: (state) => {
//             state.tables = [];
//             state.selectedTable = null;
//         },
//     },

//     /*
//     |--------------------------------------------------------------------------
//     | Async Thunks
//     |--------------------------------------------------------------------------
//     */

//     extraReducers: (builder) => {
//         builder

//             .addCase(
//                 fetchTables.pending,
//                 (state) => {
//                     state.loading = true;
//                     state.error = null;
//                 }
//             )

//             .addCase(
//                 fetchTables.fulfilled,
//                 (state, action) => {
//                     state.loading = false;

//                     /*
//                      * Depends on your API response.
//                      *
//                      * If getTables() returns:
//                      * response.data
//                      *
//                      * then this may be action.payload.data.
//                      */

//                     state.tables =
//                         action.payload?.data ||
//                         action.payload ||
//                         [];
//                 }
//             )

//             .addCase(
//                 fetchTables.rejected,
//                 (state, action) => {
//                     state.loading = false;

//                     state.error =
//                         action.payload ||
//                         "Unable to fetch tables.";
//                 }
//             );
//     },
// });

// /*
// |--------------------------------------------------------------------------
// | Actions
// |--------------------------------------------------------------------------
// */

// export const {
//     setTables,
//     addTable,
//     updateTable,
//     removeTable,
//     setSelectedTable,
//     clearSelectedTable,
//     setTableLoading,
//     setTableError,
//     clearTableError,
//     clearTables,
// } = tableSlice.actions;

// /*
// |--------------------------------------------------------------------------
// | Selectors
// |--------------------------------------------------------------------------
// */

// export const selectTables = (state) =>
//     state.table.tables;

// export const selectTableLoading = (state) =>
//     state.table.loading;

// export const selectTableError = (state) =>
//     state.table.error;

// export const selectSelectedTable = (state) =>
//     state.table.selectedTable;

// export default tableSlice.reducer;

