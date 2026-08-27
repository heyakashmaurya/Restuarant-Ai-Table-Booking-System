import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedUser = async () => {
    try {
        /*
        |--------------------------------------------------------------------------
        | Connect MongoDB
        |--------------------------------------------------------------------------
        */

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        /*
        |--------------------------------------------------------------------------
        | Check Existing User
        |--------------------------------------------------------------------------
        */

        const existingUser = await User.findOne({
            email: "admin@me.com",
        });

        if (existingUser) {
            console.log("User already exists.");
            console.log("Email: admin@me.com");
            console.log("No new user was created.");

            await mongoose.disconnect();
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Create Owner
        |--------------------------------------------------------------------------
        */

        const user = await User.create({
            fullName: "Restaurant Owner",

            email: "admin@me.com",

            phone: "9999999999",

            password: "Admin@123",

            role: "Owner",

            restaurantId: null,

            profileImage: "",

            preferredLanguage: "en",

            isActive: true,

            isDeleted: false,
        });

        console.log("-----------------------------------");
        console.log("Owner user created successfully!");
        console.log("-----------------------------------");

        console.log("ID:", user._id);
        console.log("Name:", user.fullName);
        console.log("Email:", user.email);
        console.log("Role:", user.role);

        console.log("-----------------------------------");
        console.log("Login credentials:");
        console.log("Email: admin@me.com");
        console.log("Password: Admin@123");
        console.log("-----------------------------------");

        await mongoose.disconnect();

        console.log("MongoDB disconnected.");
    } catch (error) {
        console.error("Seed error:", error);

        await mongoose.disconnect();

        process.exit(1);
    }
};

seedUser();