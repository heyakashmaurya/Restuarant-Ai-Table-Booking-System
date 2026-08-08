import jwt from "jsonwebtoken";
import dotenv from "dotenv";  
dotenv.config();

/*
|--------------------------------------------------------------------------
| Generate Access Token
|--------------------------------------------------------------------------
*/

export const generateAccessToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurantId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );

};

/*
|--------------------------------------------------------------------------
| Verify Access Token
|--------------------------------------------------------------------------
*/

export const verifyAccessToken = (token) => {

    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );

};