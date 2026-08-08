

import Table from "../../models/Table.js";
import AppError from "../../utils/AppError.js";
import { TABLE_STATUS } from "../../utils/constants.js";

/*
|--------------------------------------------------------------------------
| Create Table
|--------------------------------------------------------------------------
*/

export const createTable = async (tableData) => {

    const existingTable = await Table.findOne({
        tableNumber: tableData.tableNumber,
        isDeleted: false,
    });

    if (existingTable) {
        throw new AppError(
            "Table number already exists.",
            409
        );
    }

    return await Table.create(tableData);

};

/*
|--------------------------------------------------------------------------
| Get All Tables
|--------------------------------------------------------------------------
*/

export const getTables = async (filters = {}) => {

    const query = {
        isDeleted: false,
    };

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.location) {
        query.location = filters.location;
    }

    if (filters.floor) {
        query.floor = Number(filters.floor);
    }

    if (filters.capacity) {
        query.capacity = {
            $gte: Number(filters.capacity),
        };
    }

    if (filters.isActive !== undefined) {
        query.isActive =
            filters.isActive === "true";
    }

    return await Table.find(query).sort({
        tableNumber: 1,
    });

};

/*
|--------------------------------------------------------------------------
| Get Table By ID
|--------------------------------------------------------------------------
*/

export const getTableById = async (tableId) => {

    const table = await Table.findOne({
        _id: tableId,
        isDeleted: false,
    });

    if (!table) {
        throw new AppError(
            "Table not found.",
            404
        );
    }

    return table;

};

/*
|--------------------------------------------------------------------------
| Update Table
|--------------------------------------------------------------------------
*/

export const updateTable = async (
    tableId,
    updateData
) => {

    const table = await Table.findOne({
        _id: tableId,
        isDeleted: false,
    });

    if (!table) {
        throw new AppError(
            "Table not found.",
            404
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent Duplicate Table Number
    |--------------------------------------------------------------------------
    */

    if (
        updateData.tableNumber &&
        updateData.tableNumber !== table.tableNumber
    ) {

        const existingTable = await Table.findOne({
            tableNumber: updateData.tableNumber,
            _id: { $ne: tableId },
            isDeleted: false,
        });

        if (existingTable) {
            throw new AppError(
                "Table number already exists.",
                409
            );
        }

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Table Status
    |--------------------------------------------------------------------------
    */

    if (
        updateData.status &&
        !Object.values(TABLE_STATUS).includes(
            updateData.status
        )
    ) {
        throw new AppError(
            "Invalid table status.",
            400
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Allowed Fields
    |--------------------------------------------------------------------------
    */

    const allowedFields = [
        "tableNumber",
        "tableName",
        "capacity",
        "location",
        "floor",
        "status",
        "isActive",
        "isMergeable",
        "mergedWith",
        "notes",
    ];

    allowedFields.forEach((field) => {

        if (updateData[field] !== undefined) {
            table[field] = updateData[field];
        }

    });

    await table.save();

    return table;

};

/*
|--------------------------------------------------------------------------
| Delete Table (Soft Delete)
|--------------------------------------------------------------------------
*/

export const deleteTable = async (
    tableId
) => {

    const table = await Table.findOne({
        _id: tableId,
        isDeleted: false,
    });

    if (!table) {
        throw new AppError(
            "Table not found.",
            404
        );
    }

    table.isDeleted = true;
    table.isActive = false;

    await table.save();

    return table;

};

/*
|--------------------------------------------------------------------------
| Update Table Status
|--------------------------------------------------------------------------
*/

export const updateTableStatus = async (
    tableId,
    status
) => {

    const table = await Table.findOne({
        _id: tableId,
        isDeleted: false,
    });

    if (!table) {
        throw new AppError(
            "Table not found.",
            404
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Status
    |--------------------------------------------------------------------------
    */

    if (
        !Object.values(TABLE_STATUS).includes(
            status
        )
    ) {
        throw new AppError(
            "Invalid table status.",
            400
        );
    }

    table.status = status;

    await table.save();

    return table;

};


// import Table from "../models/Table.js";
// import AppError from "../utils/AppError.js";
// import {
//     TABLE_STATUS
// } from "../../utils/constants.js";

// /*
// |--------------------------------------------------------------------------
// | Create Table
// |--------------------------------------------------------------------------
// */

// export const createTable = async (tableData) => {
//     const existingTable = await Table.findOne({
//         tableNumber: tableData.tableNumber,
//         isDeleted: false,
//     });

//     if (existingTable) {
//         throw new AppError(
//             "Table number already exists.",
//             409
//         );
//     }

//     const table = await Table.create(tableData);

//     return table;
// };

// /*
// |--------------------------------------------------------------------------
// | Get All Tables
// |--------------------------------------------------------------------------
// */

// export const getTables = async (filters = {}) => {
//     const query = {
//         isDeleted: false,
//     };

//     if (filters.status) {
//         query.status = filters.status;
//     }

//     if (filters.location) {
//         query.location = filters.location;
//     }

//     if (filters.floor) {
//         query.floor = Number(filters.floor);
//     }

//     if (filters.capacity) {
//         query.capacity = {
//             $gte: Number(filters.capacity),
//         };
//     }

//     if (filters.isActive !== undefined) {
//         query.isActive = filters.isActive === "true";
//     }

//     return await Table.find(query).sort({
//         tableNumber: 1,
//     });
// };

// /*
// |--------------------------------------------------------------------------
// | Get Table By ID
// |--------------------------------------------------------------------------
// */

// export const getTableById = async (tableId) => {
//     const table = await Table.findOne({
//         _id: tableId,
//         isDeleted: false,
//     });

//     if (!table) {
//         throw new AppError(
//             "Table not found.",
//             404
//         );
//     }

//     return table;
// };

// /*
// |--------------------------------------------------------------------------
// | Update Table
// |--------------------------------------------------------------------------
// */

// export const updateTable = async (
//     tableId,
//     updateData
// ) => {
//     const table = await Table.findOne({
//         _id: tableId,
//         isDeleted: false,
//     });

//     if (!table) {
//         throw new AppError(
//             "Table not found.",
//             404
//         );
//     }

//     /*
// |--------------------------------------------------------------------------
// | Prevent Duplicate Table Number
// |--------------------------------------------------------------------------
// */

//     if (
//         updateData.tableNumber &&
//         updateData.tableNumber !== table.tableNumber
//     ) {

//         const existingTable = await Table.findOne({
//             tableNumber: updateData.tableNumber,
//             _id: { $ne: tableId },
//             isDeleted: false,
//         });

//         if (existingTable) {
//             throw new AppError(
//                 "Table number already exists.",
//                 409
//             );
//         }

//     }

//     const allowedFields = [
//         "tableNumber",
//         "tableName",
//         "capacity",
//         "location",
//         "floor",
//         "status",
//         "isActive",
//         "isMergeable",
//         "mergedWith",
//         "notes",
//     ];

//     allowedFields.forEach((field) => {

//         if (updateData[field] !== undefined) {
//             table[field] = updateData[field];
//         }

//     });

//     // Object.assign(table, updateData);

//     await table.save();

//     return table;
// };

// /*
// |--------------------------------------------------------------------------
// | Delete Table (Soft Delete)
// |--------------------------------------------------------------------------
// */

// export const deleteTable = async (
//     tableId
// ) => {
//     const table = await Table.findOne({
//         _id: tableId,
//         isDeleted: false,
//     });

//     if (!table) {
//         throw new AppError(
//             "Table not found.",
//             404
//         );
//     }

//     table.isDeleted = true;
//     table.isActive = false;

//     await table.save();

//     return table;
// };

// /*
// |--------------------------------------------------------------------------
// | Update Table Status
// |--------------------------------------------------------------------------
// */

// export const updateTableStatus = async (
//     tableId,
//     status
// ) => {
//     const table = await Table.findOne({
//         _id: tableId,
//         isDeleted: false,
//     });

//     if (!table) {
//         throw new AppError(
//             "Table not found.",
//             404
//         );
//     }

//     table.status = status;

//     await table.save();

//     return table;
// };