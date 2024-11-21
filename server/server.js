const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary
const dotenv = require("dotenv");
const connectDb = require("./config/dbConnection");
const parkingRoutes = require('./routes/parkingRoutes');
const walletRoutes = require('./routes/walletRoutes');
connectDb();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use('/api', userRoutes); // Use the user routes
app.use('/api/parking', parkingRoutes);
app.use('/api/wallet', walletRoutes);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});