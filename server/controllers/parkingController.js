const ParkingSlot = require('../models/parkingModel');
const User = require('../models/userModel'); // Assuming you have a User model

// Initialize parking slots (call this function once when the server starts)
const initializeParkingSlots = async () => {
    try {
        // Clear existing slots
        const deleted = await ParkingSlot.deleteMany({});
        console.log(`${deleted.deletedCount} parking slots cleared`);

        // Initialize new slots
        const slots = [];
        for (let i = 1; i <= 40; i++) {
            slots.push({ slotNumber: i });
        }

        await ParkingSlot.insertMany(slots);
        console.log("All parking slots initialized successfully");
    } catch (error) {
        console.error("Error initializing parking slots:", error);
    }
};




// Allot a parking slot
const allotParkingSlot = async (req, res) => {
    const { userEmail, vehicleType, vehicleNumber, fuelType, startTime } = req.body;

    // Validate input
    if (!userEmail || !vehicleType || !vehicleNumber || !fuelType || !startTime) {
        return res.status(400).json({ message: "All fields (userEmail, vehicleType, vehicleNumber, fuelType, startTime) are required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Find the first available slot
        const slot = await ParkingSlot.findOneAndUpdate(
            { isOccupied: false },
            {
                $set: {
                    isOccupied: true,
                    vehicleType,
                    vehicleNumber,
                    fuelType,
                    startTime: new Date(startTime), // Store the provided start time
                    userEmail, // Store the user email for reference
                },
            },
            { new: true } // Return the updated document
        );

        if (!slot) {
            return res.status(400).json({ message: "No available parking slots" });
        }

        res.status(200).json({ message: "Parking slot allotted", slotNumber: slot.slotNumber });
    } catch (error) {
        console.error("Error allotting parking slot:", error);
        res.status(500).json({ message: "Error allotting parking slot", error: error.message });
    }
};

// Deallocate a parking slot
const deallocateParkingSlot = async (req, res) => {
    const { slotNumber } = req.params; // Slot number is passed as a parameter
    const { endTime } = req.body; // End time is passed in the request body

    if (!endTime) {
        return res.status(400).json({ message: "End time is required" });
    }

    try {
        const slot = await ParkingSlot.findOne({ slotNumber });
        if (!slot || !slot.isOccupied) {
            return res.status(400).json({ message: "Slot is already free or does not exist" });
        }

        // Set the end time
        slot.endTime = new Date(endTime); // Store the provided end time

        // Calculate the time taken
        const parkedTime = slot.endTime - slot.startTime; // Time in milliseconds
        const hours = Math.floor(parkedTime / (1000 * 60 * 60)); // Convert to hours
        const minutes = Math.floor((parkedTime % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes

        // Clear the slot
        slot.isOccupied = false;
        slot.vehicleType = null;
        slot.vehicleNumber = null;
        slot.fuelType = null;
        slot.startTime = null;
        slot.endTime = null;
        slot.userEmail = null; // Clear user email
        await slot.save();

        // Return only the time taken
        res.status(200).json({
            message: "Parking slot deallocated",
            duration: {
                hours,
                minutes,
            },
        });
    } catch (error) {
        console.error("Error deallocating parking slot:", error);
        res.status(500).json({ message: "Error deallocating parking slot", error: error.message });
    }
};

// Get all parking slots
const getAllParkingSlots = async (req, res) => {
    const { isOccupied } = req.query; // Optional filter by occupancy

    try {
        const query = {};
        if (isOccupied !== undefined) {
            query.isOccupied = isOccupied === 'true'; // Convert string to boolean
        }

        const slots = await ParkingSlot.find(query);
        res.status(200).json(slots);
    } catch (error) {
        console.error("Error fetching parking slots:", error);
        res.status(500).json({ message: "Error fetching parking slots", error: error.message });
    }
};


module.exports = { initializeParkingSlots, allotParkingSlot, deallocateParkingSlot, getAllParkingSlots };
