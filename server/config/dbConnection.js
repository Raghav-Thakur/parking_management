// Import the mongoose library
const mongoose = require("mongoose");

// Create a function to connect to MongoDB
const connectDb = async () => {
    try {
        // Connect to MongoDB using the connection string from environment variables
        const connection = await mongoose.connect(process.env.CONNECTION_STRING);
        
        // Log a success message upon successful connection
        console.log("MongoDB connected successfully");
    } catch (error) {
        // Log any errors that occur during connection
        console.log("Error connecting to MongoDB:", error);
        
        // Exit the process with failure status
        process.exit(1);
    }
};

// Export the connectDb function for use in other files
module.exports = connectDb;
