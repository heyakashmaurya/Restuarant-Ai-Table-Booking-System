import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      default: "Guest"
    },
    phone: {
      type: String
    },
    guests: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    endTime: {
      type: String
    },
    tableAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table"
    },
    source: {
      type: String,
      enum: ["call", "manual", "web"],
      default: "call"
    },
    notes: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed", "no-show"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);