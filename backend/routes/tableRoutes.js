import express from "express";

import {
  createTable,
  getTables,
  updateTableStatus,
  deleteTable
} from "../controllers/tableController.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* Admin / Staff Read */
router.get("/", protect, getTables);

/* Admin Only Write */
router.post("/", protect, authorize("admin"), createTable);

router.put(
  "/:id/status",
  protect,
  authorize("admin", "staff"),
  updateTableStatus
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteTable
);

export default router;