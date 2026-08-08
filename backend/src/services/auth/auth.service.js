
import User from "../../models/User.js";
import { generateAccessToken } from "../../utils/jwt.js";

import ApiError from "../../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

const register = async (payload) => {

    const {
        fullName,
        email,
        password,
        phone,
    } = payload;

    /*
    |--------------------------------------------------------------------------
    | Check Existing User
    |--------------------------------------------------------------------------
    */

    const existingUser = await User.findOne({
        email,
        isDeleted: false,
    });

    if (existingUser) {
        throw new ApiError(409, "Email already registered.");
    }

    /*
    |--------------------------------------------------------------------------
    | Create User
    |--------------------------------------------------------------------------
    */

    const user = await User.create({
        fullName,
        email,
        password,
        phone,
    });

    /*
    |--------------------------------------------------------------------------
    | Generate Token
    |--------------------------------------------------------------------------
    */

    const token = generateAccessToken(user);

    return {
        user,
        token,
    };

};

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

const login = async (email, password) => {

    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    const user = await User.findOne({
        email,
        isDeleted: false,
    }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password.");
    }

    /*
    |--------------------------------------------------------------------------
    | Check Active
    |--------------------------------------------------------------------------
    */

    if (!user.isActive) {
        throw new ApiError(403, "Account has been disabled.");
    }

    /*
    |--------------------------------------------------------------------------
    | Compare Password
    |--------------------------------------------------------------------------
    */

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password.");
    }

    /*
    |--------------------------------------------------------------------------
    | Update Last Login
    |--------------------------------------------------------------------------
    */

    user.lastLogin = new Date();

    await user.save();

    /*
    |--------------------------------------------------------------------------
    | Generate Token
    |--------------------------------------------------------------------------
    */

    const token = generateAccessToken(user);

    return {
        user,
        token,
    };

};

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

const getProfile = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    return user;

};

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

const updateProfile = async (userId, payload) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const allowedFields = [
        "fullName",
        "phone",
        "preferredLanguage",
        "profileImage",
    ];

    allowedFields.forEach((field) => {

        if (payload[field] !== undefined) {
            user[field] = payload[field];
        }

    });

    await user.save();

    return user;

};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    const user = await User.findById(userId)
        .select("+password");

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const isMatch = await user.comparePassword(
        currentPassword
    );

    if (!isMatch) {
        throw new ApiError(401, "Current password is incorrect.");
    }

    user.password = newPassword;

    user.passwordChangedAt = new Date();

    await user.save();

    return true;

};

export default {

    register,

    login,

    getProfile,

    updateProfile,

    changePassword,

};