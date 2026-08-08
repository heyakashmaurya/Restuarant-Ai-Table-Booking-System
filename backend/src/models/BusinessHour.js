import mongoose from "mongoose";
import { baseSchemaOptions } from "./BaseModel.js";

const businessHourSchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | Day of Week
        |--------------------------------------------------------------------------
        */

        day: {
            type: String,
            required: true,
            unique: true,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
        },

        /*
        |--------------------------------------------------------------------------
        | Opening Hours
        |--------------------------------------------------------------------------
        */

        openTime: {
            type: String,
            required: true,
            trim: true,
        },

        closeTime: {
            type: String,
            required: true,
            trim: true,
        },

        /*
        |--------------------------------------------------------------------------
        | Optional Break Time
        |--------------------------------------------------------------------------
        */

        breakStart: {
            type: String,
            default: "",
        },

        breakEnd: {
            type: String,
            default: "",
        },

        /*
        |--------------------------------------------------------------------------
        | Booking Settings
        |--------------------------------------------------------------------------
        */

        acceptsBookings: {
            type: Boolean,
            default: true,
        },

        isClosed: {
            type: Boolean,
            default: false,
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

businessHourSchema.index({
    day: 1,
    isDeleted: 1,
});

export default mongoose.model(
    "BusinessHour",
    businessHourSchema
);