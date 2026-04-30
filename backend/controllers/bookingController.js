import Reservation from "../models/Reservation.js";
import { findBestAvailableTable } from "../services/allocationService.js";
import { io } from "../server.js";

/* ---------------------------------- */
/* Create Booking                     */
/* ---------------------------------- */
export const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      guests,
      date,
      time,
      notes,
      source
    } = req.body;

    const table = await findBestAvailableTable({
      guests,
      date,
      time
    });

    if (!table) {
      return res.status(400).json({
        success: false,
        message: "No table available for selected slot"
      });
    }

    const booking = await Reservation.create({
      customerName,
      phone,
      guests,
      date,
      time,
      notes,
      source,
      tableAssigned: table._id
    });

    const populated = await Reservation.findById(
      booking._id
    ).populate("tableAssigned");

    io.emit("new-booking", populated);

    res.status(201).json({
      success: true,
      booking: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------------------------- */
/* Get All Bookings                   */
/* ---------------------------------- */
export const getBookings = async (req, res) => {
  try {
    const bookings = await Reservation.find()
      .populate("tableAssigned")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------------------------- */
/* Update Booking                     */
/* ---------------------------------- */
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Reservation.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).populate("tableAssigned");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    io.emit("booking-updated", booking);

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------------------------- */
/* Delete Booking                     */
/* ---------------------------------- */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Reservation.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    io.emit("booking-deleted", { id });

    res.status(200).json({
      success: true,
      message: "Booking deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};