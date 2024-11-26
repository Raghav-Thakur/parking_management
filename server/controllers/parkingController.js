const ParkingSlot = require('../models/parkingModel');
const User = require('../models/userModel');
const walletController = require('./walletController');
const pricingStructure = {
    "Car": {
        "Petrol": 10,
        "Diesel": 12,
        "Electric": 8
    },
    "Bike": {
        "Petrol": 5,
        "Diesel": 6,
        "Electric": 4
    },
    "Truck": {
        "Petrol": 15,
        "Diesel": 18,
        "Electric": 14
    }
};

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
            return res.status(404).json({ message: "User not found" });
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
                    startTime: new Date(startTime),
                    userEmail,
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
    const { slotNumber } = req.params;
    const { endTime } = req.body;

    // Validate input
    if (!slotNumber) {
        return res.status(400).json({ message: "slotNumber is required" });
    }
    if (!endTime) {
        return res.status(400).json({ message: "endTime is required" });
    }

    try {
        // Find the parking slot by slot number
        const slot = await ParkingSlot.findOne({ slotNumber, isOccupied: true });
        if (!slot) {
            return res.status(404).json({ message: "Slot not found or already free" });
        }

        // Parse the endTime from the request body
        const parsedEndTime = new Date(endTime);
        if (isNaN(parsedEndTime)) {
            return res.status(400).json({ message: "Invalid endTime format" });
        }

        // Calculate parking duration in minutes
        const parkedDuration = Math.ceil((parsedEndTime - slot.startTime) / (1000 * 60)); // Duration in minutes

        // Calculate parking fee based on vehicle type and fuel type
        const vehicleType = slot.vehicleType;
        const fuelType = slot.fuelType;

        const hourlyRate = pricingStructure[vehicleType]?.[fuelType];
        if (!hourlyRate) {
            return res.status(400).json({ message: "Invalid vehicle type or fuel type" });
        }

        const parkingFee = Math.ceil(parkedDuration / 60) * hourlyRate; // Fee calculation

        // Deduct fee from user's wallet
        const deductResponse = await walletController.deductMoney({ body: { email: slot.userEmail, amount: parkingFee } });
        if (deductResponse.status !== 200) {
            return res.status(deductResponse.status).json(deductResponse.data);
        }

        // Deallocate the parking slot
        slot.isOccupied = false;
        slot.vehicleType = null;
        slot.vehicleNumber = null;
        slot.fuelType = null;
        slot.startTime = null;
        slot.endTime = null;
        slot.userEmail = null;
        await slot.save();

        // Respond with success and parking details
        res.status(200).json({
            message: "Parking slot deallocated successfully",
            duration: `${Math.floor(parkedDuration / 60)} hours and ${parkedDuration % 60} minutes`,
            fee: parkingFee
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
