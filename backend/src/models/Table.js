import mongoose from "mongoose";
import { baseSchemaOptions } from "./BaseModel.js";

const tableSchema = new mongoose.Schema(
    {
        tableNumber: {
            type: Number,
            required: true,
            unique: true,
            min: 1,
            index: true,
        },

        tableName: {
            type: String,
            trim: true,
            default: "",
            maxlength: 50,
        },

        capacity: {
            type: Number,
            required: true,
            min: 1,
            max: 50,
        },

        location: {
            type: String,
            enum: ["Indoor", "Outdoor", "Window", "Private"],
            default: "Indoor",
        },

        floor: {
            type: Number,
            default: 1,
            min: 1,
        },

        status: {
            type: String,
            enum: [
                "Available",
                "Reserved",
                "Occupied",
                "Maintenance",
            ],
            default: "Available",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isMergeable: {
            type: Boolean,
            default: false,
        },

        mergedWith: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Table",
            },
        ],

        notes: {
            type: String,
            default: "",
            maxlength: 500,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    baseSchemaOptions
);

export default mongoose.model("Table", tableSchema);