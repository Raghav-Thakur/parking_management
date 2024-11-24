const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary
const dotenv = require("dotenv");
const connectDb = require("./config/dbConnection");
const parkingRoutes = require('./routes/parkingRoutes');
const walletRoutes = require('./routes/walletRoutes');
const { initializeParkingSlots } = require('./controllers/parkingController'); // Corrected import
// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDb();

const app = express();
const PORT = process.env.PORT || 5500; 

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use('/api', userRoutes); // Use the user routes
app.use('/api/parking', parkingRoutes);
app.use('/api/wallet', walletRoutes);

// Start the server and initialize parking slots
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await initializeParkingSlots();
});