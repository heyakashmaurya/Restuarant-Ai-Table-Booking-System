import jwt from "jsonwebtoken";
import dotenv from "dotenv";  
dotenv.config();

/*
|--------------------------------------------------------------------------
| Generate Access Token
|--------------------------------------------------------------------------
*/

export const generateAccessToken = (user) => {

    console.log("Generating token for:", user.email);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const token =  jwt.sign(
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

    console.log("TOKEN GENERATED:", token);

    return token;

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