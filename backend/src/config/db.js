import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

import mongoose from "mongoose";
import env from "./env.js";


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // console.error("MongoDB Connection Failed:", error.message);
    console.error("MongoDB Connection Failed:");
console.error(error);
    process.exit(1);
  }
};

export default connectDB;
