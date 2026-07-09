import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  baseUrl:process.env.BASE_URL,
  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  geminiApiKey: process.env.GEMINI_API_KEY,

  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  twilioWebhookUrl: process.env.TWILIO_WEBHOOK_URL,

  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,

  timezone: process.env.TIMEZONE || "Asia/Kolkata",
  restaurantName: process.env.RESTAURANT_NAME || "Restaurant"
};

export default env;