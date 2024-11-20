const mongoose = require("mongoose");
require('dotenv').config();

const connectDb = async () => {
    try {
        if (!process.env.CONNECTION_STRING) {
            console.error("MongoDB connection string is not set in environment variables.");
            process.exit(1);
        }

        const connection = await mongoose.connect(process.env.CONNECTION_STRING);

        console.log(`MongoDB connected: ${process.env.CONNECTION_STRING}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        console.error(error.stack);
        process.exit(1);
    }

    process.on("SIGINT", async () => {
        console.log("SIGINT signal received: closing MongoDB connection...");
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
        process.exit(0);
    });
};

module.exports = connectDb;
