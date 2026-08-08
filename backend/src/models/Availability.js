import mongoose from "mongoose";
import { baseSchemaOptions } from "./BaseModel.js";

const availabilitySchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | Override Date
        |--------------------------------------------------------------------------
        */

        date: {
            type: Date,
            required: true,
            unique: true,
            index: true,
        },

        /*
        |--------------------------------------------------------------------------
        | Override Type
        |--------------------------------------------------------------------------
        */

        type: {
            type: String,
            required: true,
            enum: [
                "Closed",              // Entire restaurant closed
                "Private Event",       // Restaurant reserved
                "Limited Seating",     // Reduced capacity
                "Custom Hours",        // Different opening hours
            ],
        },

        /*
        |--------------------------------------------------------------------------
        | Used only when type = Custom Hours
        |--------------------------------------------------------------------------
        */

        openTime: {
            type: String,
            default: "",
        },

        closeTime: {
            type: String,
            default: "",
        },

        /*
        |--------------------------------------------------------------------------
        | Capacity Reduction
        |--------------------------------------------------------------------------
        */

        unavailableTables: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Table",
            },
        ],

        /*
        |--------------------------------------------------------------------------
        | Admin Notes
        |--------------------------------------------------------------------------
        */

        reason: {
            type: String,
            default: "",
            maxlength: 300,
        },

        notes: {
            type: String,
            default: "",
            maxlength: 1000,
        },

        /*
        |--------------------------------------------------------------------------
        | Soft Delete
        |--------------------------------------------------------------------------
        */

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    baseSchemaOptions
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

availabilitySchema.index({
    date: 1,
    isDeleted: 1,
});

export default mongoose.model(
    "Availability",
    availabilitySchema
);