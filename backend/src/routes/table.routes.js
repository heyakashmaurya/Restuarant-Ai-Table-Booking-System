import express from "express";

import {
    createTable,
    getTables,
    getTableById,
    updateTable,
    deleteTable,
    updateTableStatus,
} from "../controllers/table.controller.js";

import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.use(auth);

router.post(
    "/",
    authorize("Owner", "Manager"),
    createTable
);

router.get(
    "/",
    authorize("Owner", "Manager", "Staff"),
    getTables
);

router.get(
    "/:id",
    authorize("Owner", "Manager", "Staff"),
    getTableById
);

router.put(
    "/:id",
    authorize("Owner", "Manager"),
    updateTable
);

router.patch(
    "/:id/status",
    authorize("Owner", "Manager", "Staff"),
    updateTableStatus
);

router.delete(
    "/:id",
    authorize("Owner", "Manager"),
    deleteTable
);

export default router;