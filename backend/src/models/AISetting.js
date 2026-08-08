import mongoose from "mongoose";
import { baseSchemaOptions } from "./BaseModel.js";

const aiSettingSchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | Restaurant Information
        |--------------------------------------------------------------------------
        */

        restaurantName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        restaurantPhone: {
            type: String,
            default: "",
            trim: true,
        },

        restaurantEmail: {
            type: String,
            default: "",
            trim: true,
            lowercase: true,
        },

        timezone: {
            type: String,
            default: "Asia/Kolkata",
        },

        /*
        |--------------------------------------------------------------------------
        | AI Voice Settings
        |--------------------------------------------------------------------------
        */

        assistantName: {
            type: String,
            default: "Restaurant Assistant",
            trim: true,
            maxlength: 100,
        },

        language: {
            type: String,
            enum: ["en", "hi"],
            default: "en",
        },

        fallbackLanguage: {
            type: String,
            enum: ["en", "hi"],
            default: "en",
        },

        voiceProvider: {
            type: String,
            enum: [
                "ElevenLabs",
                "Sarvam",
            ],
            default: "ElevenLabs",
        },

        voiceId: {
            type: String,
            default: "",
        },

        /*
        |--------------------------------------------------------------------------
        | Booking Rules
        |--------------------------------------------------------------------------
        */

        bookingDurationMinutes: {
            type: Number,
            default: 120,
            min: 30,
            max: 480,
        },

        bookingBufferMinutes: {
            type: Number,
            default: 15,
            min: 0,
            max: 120,
        },

        maxGuestsPerBooking: {
            type: Number,
            default: 20,
            min: 1,
            max: 100,
        },

        advanceBookingDays: {
            type: Number,
            default: 30,
            min: 1,
            max: 365,
        },

        defaultBookingStatus: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
            ],
            default: "Confirmed",
        },

        autoAssignTable: {
            type: Boolean,
            default: true,
        },

        requireConfirmation: {
            type: Boolean,
            default: true,
        },

        /*
        |--------------------------------------------------------------------------
        | AI Conversation
        |--------------------------------------------------------------------------
        */

        welcomeMessage: {
            type: String,
            default:
                "Welcome to our restaurant. How may I help you today?",
            maxlength: 500,
        },

        goodbyeMessage: {
            type: String,
            default:
                "Thank you for choosing our restaurant. Have a wonderful day!",
            maxlength: 500,
        },

        systemPrompt: {
            type: String,
            default: "",
            maxlength: 5000,
        },

        askOccasion: {
            type: Boolean,
            default: true,
        },

        askSpecialRequests: {
            type: Boolean,
            default: true,
        },

        /*
        |--------------------------------------------------------------------------
        | Features
        |--------------------------------------------------------------------------
        */

        aiEnabled: {
            type: Boolean,
            default: true,
        },

        allowCancellation: {
            type: Boolean,
            default: true,
        },

        allowModification: {
            type: Boolean,
            default: true,
        },

        recordCalls: {
            type: Boolean,
            default: true,
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

export default mongoose.model(
    "AISetting",
    aiSettingSchema
);