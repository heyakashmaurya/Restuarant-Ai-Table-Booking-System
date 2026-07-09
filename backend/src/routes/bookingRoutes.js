import express from "express";

import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
} from "../controllers/bookingController.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBookings);

router.post(
  "/create",
  protect,
  authorize("admin", "staff"),
  createBooking
);

router.put(
  "/:id",
  protect,
  authorize("admin", "staff"),
  updateBooking
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "staff"),
  deleteBooking
);

export default router;