import mongoose from "mongoose";
import { baseSchemaOptions } from "./BaseModel.js";

const notificationSchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | Relations
        |--------------------------------------------------------------------------
        */

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            index: true,
        },

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            default: null,
            index: true,
        },

        /*
        |--------------------------------------------------------------------------
        | Notification
        |--------------------------------------------------------------------------
        */

        type: {
            type: String,
            enum: [
                "Booking Confirmation",
                "Booking Reminder",
                "Booking Updated",
                "Booking Cancelled",
                "Payment Confirmation",
                "Custom",
            ],
            required: true,
            index: true,
        },

        channel: {
            type: String,
            enum: [
                "SMS",
                "Email",
                "WhatsApp",
                "Voice Call",
            ],
            required: true,
        },

        recipient: {
            type: String,
            required: true,
            trim: true,
        },

        subject: {
            type: String,
            default: "",
            maxlength: 200,
        },

        message: {
            type: String,
            required: true,
        },

        /*
        |--------------------------------------------------------------------------
        | Delivery Status
        |--------------------------------------------------------------------------
        */

        status: {
            type: String,
            enum: [
                "Pending",
                "Queued",
                "Sent",
                "Delivered",
                "Failed",
                "Read",
            ],
            default: "Pending",
            index: true,
        },

        provider: {
            type: String,
            default: "",
        },

        providerMessageId: {
            type: String,
            default: "",
        },

        sentAt: {
            type: Date,
            default: null,
        },

        deliveredAt: {
            type: Date,
            default: null,
        },

        errorMessage: {
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

export default mongoose.model("Notification", notificationSchema);