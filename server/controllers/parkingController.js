const ParkingSlot = require('../models/parkingModel');

// Initialize parking slots (call this function once when the server starts)
const initializeParkingSlots = async () => {
    try {
        const existingSlots = await ParkingSlot.countDocuments();
        if (existingSlots === 0) {
            for (let i = 1; i <= 40; i++) {
                const slot = new ParkingSlot({ slotNumber: i });
                await slot.save();
            }
            console.log('Parking slots initialized');
        }
    } catch (error) {
        console.error('Error initializing parking slots:', error.message);
    }
};

// Allot a parking slot
const allotParkingSlot = async (req, res) => {
    const { vehicleType, vehicleNumber, fuelType } = req.body;

    // Validate input
    if (!vehicleType || !vehicleNumber || !fuelType) {
        return res.status(400).json({ message: "All fields (vehicleType, vehicleNumber, fuelType) are required" });
    }

    try {
        // Find and update the first available slot atomically
        const slot = await ParkingSlot.findOneAndUpdate(
            { isOccupied: false },
            { 
                $set: { 
                    isOccupied: true, 
                    vehicleType, 
                    vehicleNumber, 
                    fuelType, 
                    timestamp: new Date() 
                } 
            },
            { new: true } // Return the updated document
        );

        if (!slot) {
            return res.status(400).json({ message: "No available parking slots" });
        }

        res.status(200).json({ message: "Parking slot allotted", slotNumber: slot.slotNumber });
    } catch (error) {
        res.status(500).json({ message: "Error allotting parking slot", error: error.message });
    }
};

// Deallocate a parking slot
const deallocateParkingSlot = async (req, res) => {
    const { slotNumber } = req.params;

    try {
        const slot = await ParkingSlot.findOne({ slotNumber });
        if (!slot || !slot.isOccupied) {
            return res.status(400).json({ message: "Slot is already free or does not exist" });
        }

        // Calculate the time taken
        const parkedTime = new Date() - slot.timestamp; // Time in milliseconds
        const hours = Math.floor(parkedTime / (1000 * 60 * 60)); // Convert to hours
        const minutes = Math.floor((parkedTime % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes

        // Clear the slot
        slot.isOccupied = false;
        slot.vehicleType = null; // Clear vehicle type
        slot.vehicleNumber = null; // Clear vehicle number
        slot.fuelType = null; // Clear fuel type
        slot.timestamp = null; // Clear timestamp
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
        res.status(500).json({ message: "Error fetching parking slots", error: error.message });
    }
};

module.exports = { initializeParkingSlots, allotParkingSlot, deallocateParkingSlot, getAllParkingSlots };
