import https from "https"
import dotenv from "dotenv"
dotenv.config()

const apiKey = process.env.ELEVENLABS_API_KEY;

console.log("Node:", process.version);
console.log("API key loaded:", !!apiKey);

const options = {
  hostname: "api.elevenlabs.io",
  port: 443,
  path: "/v1/user",
  method: "GET",
  headers: {
    "xi-api-key": apiKey,
  },
};

const req = https.request(options, (res) => {
  console.log("HTTP STATUS:", res.statusCode);

  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Response:", data);
  });
});

req.on("error", (error) => {
  console.error("NODE HTTPS ERROR:");
  console.error(error);
});

req.end();