import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/User.js";

const auth = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                success: false,
                message: "Authentication token is missing.",
            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyAccessToken(token);

        const user = await User.findById(decoded.id);

        if (!user || user.isDeleted) {

            return res.status(401).json({
                success: false,
                message: "User not found.",
            });

        }

        if (!user.isActive) {

            return res.status(403).json({
                success: false,
                message: "Account has been disabled.",
            });

        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });

    }

};

export default auth;