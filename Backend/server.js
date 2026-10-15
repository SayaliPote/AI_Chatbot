import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); // fixes SRV lookup failures for mongodb+srv on some networks

import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";

if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET in Backend/.env (add any long random string).");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch (err) {
        console.log("Failed to connect with Db", err);
    }
};

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});
