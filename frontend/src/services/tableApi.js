

import api from "./api.js";

/*
|--------------------------------------------------------------------------
| Table API Service
|--------------------------------------------------------------------------
|
| All table-related HTTP requests live here.
|
| Components/pages should NOT call axios directly.
|
| Tables.jsx
|    ↓
| tableSlice.js
|    ↓
| tableApi.js
|    ↓
| api.js
|    ↓
| Backend
|
|--------------------------------------------------------------------------
*/

const TABLE_BASE_URL = "/tables";


/*
|--------------------------------------------------------------------------
| Get Tables
|--------------------------------------------------------------------------
|
| GET /api/tables/gettable
|
| Supported filters:
|
| status
| location
| floor
| capacity
| isActive
|
|--------------------------------------------------------------------------
*/

export const getTables = async ({
    status,
    location,
    floor,
    capacity,
    isActive,
} = {}) => {

    const params = {};

    if (status && status !== "all") {
        params.status = status;
    }

    if (location && location !== "all") {
        params.location = location;
    }

    if (
        floor !== undefined &&
        floor !== null &&
        floor !== "" &&
        floor !== "all"
    ) {
        params.floor = floor;
    }

    if (
        capacity !== undefined &&
        capacity !== null &&
        capacity !== ""
    ) {
        params.capacity = capacity;
    }

    if (
        isActive !== undefined &&
        isActive !== null &&
        isActive !== ""
    ) {
        params.isActive = isActive;
    }

    const response = await api.get(
        `${TABLE_BASE_URL}/gettable`,
        {
            params,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Table
|--------------------------------------------------------------------------
|
| GET /api/tables/:id
|
|--------------------------------------------------------------------------
*/

export const getTable = async (
    tableId
) => {

    if (!tableId) {
        throw new Error(
            "Table ID is required."
        );
    }

    const response = await api.get(
        `${TABLE_BASE_URL}/${tableId}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Create Table
|--------------------------------------------------------------------------
|
| POST /api/tables/create
|
|--------------------------------------------------------------------------
*/

export const createTable = async ({
    tableNumber,
    tableName,
    capacity,
    location = "",
    floor = "",
    status = "available",
    isActive = true,
    isMergeable = false,
    mergedWith = [],
    notes = "",
} = {}) => {

    if (
        tableNumber === undefined ||
        tableNumber === null ||
        tableNumber === ""
    ) {
        throw new Error(
            "Table number is required."
        );
    }

    if (
        capacity === undefined ||
        capacity === null ||
        Number(capacity) <= 0
    ) {
        throw new Error(
            "Table capacity must be greater than 0."
        );
    }

    const payload = {
        tableNumber: Number(tableNumber),
        tableName: tableName?.trim() || "",
        capacity: Number(capacity),
        location: location?.trim() || "",
        floor,
        status,
        isActive,
        isMergeable,
        mergedWith,
        notes: notes?.trim() || "",
    };

    const response = await api.post(
        `${TABLE_BASE_URL}/create`,
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Table
|--------------------------------------------------------------------------
|
| PUT /api/tables/:id
|
|--------------------------------------------------------------------------
*/

export const updateTable = async (
    tableId,
    updates
) => {

    if (!tableId) {
        throw new Error(
            "Table ID is required."
        );
    }

    if (
        !updates ||
        typeof updates !== "object"
    ) {
        throw new Error(
            "Table update data is required."
        );
    }

    const response = await api.put(
        `${TABLE_BASE_URL}/${tableId}`,
        updates
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Table Status
|--------------------------------------------------------------------------
|
| PATCH /api/tables/:id/status
|
|--------------------------------------------------------------------------
*/

export const updateTableStatus = async (
    tableId,
    status
) => {

    if (!tableId) {
        throw new Error(
            "Table ID is required."
        );
    }

    if (!status) {
        throw new Error(
            "Table status is required."
        );
    }

    const response = await api.patch(
        `${TABLE_BASE_URL}/${tableId}/status`,
        {
            status,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Table
|--------------------------------------------------------------------------
|
| DELETE /api/tables/:id
|
|--------------------------------------------------------------------------
*/

export const deleteTable = async (
    tableId
) => {

    if (!tableId) {
        throw new Error(
            "Table ID is required."
        );
    }

    const response = await api.delete(
        `${TABLE_BASE_URL}/${tableId}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Export Default
|--------------------------------------------------------------------------
*/

const tableApi = {
    getTables,
    getTable,
    createTable,
    updateTable,
    updateTableStatus,
    deleteTable,
};

export default tableApi;



// import api from "./api.js";

// /*
// |--------------------------------------------------------------------------
// | Table API Service
// |--------------------------------------------------------------------------
// |
// | All dashboard table HTTP requests live here.
// |
// | Components/pages should NOT call axios directly.
// |
// | Dashboard
// |    ↓
// | tableSlice
// |    ↓
// | tableApi
// |    ↓
// | api.js
// |    ↓
// | Backend
// |
// |--------------------------------------------------------------------------
// */

// const TABLE_BASE_URL = "/tables";


// /*
// |--------------------------------------------------------------------------
// | Get Tables
// |--------------------------------------------------------------------------
// |
// | GET /api/tables
// |
// | Supported query parameters depend on your backend service.
// |
// |--------------------------------------------------------------------------
// */

// export const getTables = async ({
//     status,
//     location,
//     floor,
//     isActive,
//     page,
//     limit,
// } = {}) => {

//     const params = {};

//     /*
//     |--------------------------------------------------------------------------
//     | Optional Filters
//     |--------------------------------------------------------------------------
//     */

//     if (status) {
//         params.status = status;
//     }

//     if (location) {
//         params.location = location;
//     }

//     if (floor !== undefined && floor !== null) {
//         params.floor = floor;
//     }

//     if (isActive !== undefined && isActive !== null) {
//         params.isActive = isActive;
//     }

//     if (page !== undefined && page !== null) {
//         params.page = page;
//     }

//     if (limit !== undefined && limit !== null) {
//         params.limit = limit;
//     }


//     /*
//     |--------------------------------------------------------------------------
//     | Request
//     |--------------------------------------------------------------------------
//     */

//     const response = await api.get(
//         TABLE_BASE_URL,
//         {
//             params,
//         }
//     );


//     return response.data;
// };


// /*
// |--------------------------------------------------------------------------
// | Get Single Table
// |--------------------------------------------------------------------------
// |
// | GET /api/tables/:id
// |
// |--------------------------------------------------------------------------
// */

// export const getTable = async (
//     tableId
// ) => {

//     if (!tableId) {
//         throw new Error(
//             "Table ID is required."
//         );
//     }


//     const response = await api.get(
//         `${TABLE_BASE_URL}/${tableId}`
//     );


//     return response.data;
// };


// /*
// |--------------------------------------------------------------------------
// | Create Table
// |--------------------------------------------------------------------------
// |
// | POST /api/tables
// |
// |--------------------------------------------------------------------------
// */

// export const createTable = async ({
//     tableName,
//     capacity,
//     location = "",
//     floor,
//     status = "available",
//     isActive = true,
//     isMergeable = false,
//     mergedWith = [],
//     notes = "",
// } = {}) => {

//     const payload = {
//         tableName,
//         capacity,
//         location,
//         floor,
//         status,
//         isActive,
//         isMergeable,
//         mergedWith,
//         notes,
//     };


//     const response = await api.post(
//         TABLE_BASE_URL,
//         payload
//     );


//     return response.data;
// };


// /*
// |--------------------------------------------------------------------------
// | Update Table
// |--------------------------------------------------------------------------
// |
// | PATCH /api/tables/:id
// |
// |--------------------------------------------------------------------------
// */

// export const updateTable = async (
//     tableId,
//     updates
// ) => {

//     console.log(
//         "API updateTable tableId:",
//         tableId
//     );


//     if (!tableId) {
//         throw new Error(
//             "Table ID is required."
//         );
//     }


//     if (
//         !updates ||
//         typeof updates !== "object"
//     ) {
//         throw new Error(
//             "Table update data is required."
//         );
//     }


//     const response = await api.patch(
//         `${TABLE_BASE_URL}/${tableId}`,
//         updates
//     );


//     return response.data;
// };


// /*
// |--------------------------------------------------------------------------
// | Delete Table
// |--------------------------------------------------------------------------
// |
// | DELETE /api/tables/:id
// |
// |--------------------------------------------------------------------------
// */

// export const deleteTable = async (
//     tableId
// ) => {

//     if (!tableId) {
//         throw new Error(
//             "Table ID is required."
//         );
//     }


//     const response = await api.delete(
//         `${TABLE_BASE_URL}/${tableId}`
//     );


//     return response.data;
// };


// /*
// |--------------------------------------------------------------------------
// | Update Table Status
// |--------------------------------------------------------------------------
// |
// | PATCH /api/tables/:id/status
// |
// |--------------------------------------------------------------------------
// */

// export const updateTableStatus = async (
//     tableId,
//     status
// ) => {

//     if (!tableId) {
//         throw new Error(
//             "Table ID is required."
//         );
//     }


//     if (!status) {
//         throw new Error(
//             "Table status is required."
//         );
//     }


//     const response = await api.patch(
//         `${TABLE_BASE_URL}/${tableId}/status`,
//         {
//             status,
//         }
//     );


//     return response.data;
// };


// /*
// |--------------------------------------------------------------------------
// | Export Default
// |--------------------------------------------------------------------------
// */

// const tableApi = {
//     getTables,
//     getTable,
//     createTable,
//     updateTable,
//     deleteTable,
//     updateTableStatus,
// };

// export default tableApi;