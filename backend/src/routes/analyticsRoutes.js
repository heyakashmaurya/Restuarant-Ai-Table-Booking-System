import express from "express";

import {
    getAnalyticsOverviewController,
} from "../controllers/analytics.controller.js";

import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";


const router =
    express.Router();


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(
    auth
);


/*
|--------------------------------------------------------------------------
| Analytics Overview
|--------------------------------------------------------------------------
|
| GET /api/analytics/overview
|
| Optional:
|
| ?from=2026-08-01
| &to=2026-08-28
|
|--------------------------------------------------------------------------
*/

router.get(
    "/overview",
    authorize(
        "Owner",
        "Manager",
        "Staff"
    ),
    getAnalyticsOverviewController
);


export default router;