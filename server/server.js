// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/dbConnection"); // Adjust the path if necessary

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDb();

// Define a simple route for testing
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});