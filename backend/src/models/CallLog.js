import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema(
  {
    callerNumber: {
      type: String
    },
    transcript: {
      type: String,
      default: ""
    },
    aiResponses: {
      type: [String],
      default: []
    },
    duration: {
      type: Number,
      default: 0
    },
    result: {
      type: String,
      enum: ["booked", "cancelled", "inquiry", "missed", "unknown"],
      default: "unknown"
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation"
    }
  },
  { timestamps: true }
);

export default mongoose.model("CallLog", callLogSchema);