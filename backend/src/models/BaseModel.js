import mongoose from "mongoose";

const baseSchemaOptions = {
    timestamps: true,

    toJSON: {
        virtuals: true,
        versionKey: false,
        transform(doc, ret) {
            delete ret._id;
        },
    },

    toObject: {
        virtuals: true,
    },
};

export { baseSchemaOptions };