import mongoose from "mongoose";
import { baseSchemaOptions } from "./BaseModel.js";

const paymentSchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | Relations
        |--------------------------------------------------------------------------
        */

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            index: true,
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            index: true,
        },

        /*
        |--------------------------------------------------------------------------
        | Payment Details
        |--------------------------------------------------------------------------
        */

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
            uppercase: true,
        },

        paymentMethod: {
            type: String,
            enum: [
                "Cash",
                "Card",
                "UPI",
                "Net Banking",
                "Wallet",
                "Online",
                "Other",
            ],
            default: "Cash",
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed",
                "Refunded",
                "Partially Refunded",
            ],
            default: "Pending",
            index: true,
        },

        /*
        |--------------------------------------------------------------------------
        | Gateway Information
        |--------------------------------------------------------------------------
        */

        transactionId: {
            type: String,
            default: "",
            trim: true,
        },

        paymentGateway: {
            type: String,
            enum: [
                "",
                "Razorpay",
                "Stripe",
                "Cashfree",
                "PhonePe",
                "Paytm",
                "Other",
            ],
            default: "",
        },

        gatewayResponse: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        /*
        |--------------------------------------------------------------------------
        | Refund
        |--------------------------------------------------------------------------
        */

        refundedAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        refundReason: {
            type: String,
            default: "",
            maxlength: 500,
        },

        /*
        |--------------------------------------------------------------------------
        | Notes
        |--------------------------------------------------------------------------
        */

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

export default mongoose.model("Payment", paymentSchema);