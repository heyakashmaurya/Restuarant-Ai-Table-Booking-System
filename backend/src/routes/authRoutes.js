import express from "express";

import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
} from "../controllers/authController.js";

import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post("/register", register);

router.post("/login", login);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/profile",
    auth,
    getProfile
);

router.put(
    "/profile",
    auth,
    updateProfile
);

router.put(
    "/change-password",
    auth,
    changePassword
);

export default router;