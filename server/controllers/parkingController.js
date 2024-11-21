const ParkingSlot = require('../models/parkingModel');

// Initialize parking slots (call this function once when the server starts)
const initializeParkingSlots = async () => {
    const existingSlots = await ParkingSlot.countDocuments();
    if (existingSlots === 0) {
        for (let i = 1; i <= 40; i++) {
            const slot = new ParkingSlot({ slotNumber: i });
            await slot.save();
        }
        console.log('Parking slots initialized');
    }
};

// Allot a parking slot
const allotParkingSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findOne({ isOccupied: false });
        if (!slot) {
            return res.status(400).json({ message: "No available parking slots" });
        }

        slot.isOccupied = true;
        await slot.save();

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

        slot.isOccupied = false;
        await slot.save();

        res.status(200).json({ message: "Parking slot deallocated", slotNumber });
    } catch (error) {
        res.status(500).json({ message: "Error deallocating parking slot", error: error.message });
    }
};
const getAllParkingSlots = async (req, res) => {
    try {
        const slots = await ParkingSlot.find({});
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: "Error fetching parking slots", error: error.message });
    }
};

// Export the controller functions
module.exports = { initializeParkingSlots, allotParkingSlot, deallocateParkingSlot,getAllParkingSlots };