import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true
    },
    area: {
      type: String,
      enum: ["AC", "Outdoor", "Indoor"],
      default: "Indoor"
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Table", tableSchema);