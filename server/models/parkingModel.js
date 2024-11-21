const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
    slotNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    isOccupied: {
        type: Boolean,
        default: false,
    },
    vehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'truck'],
        default: null,
    },
    vehicleNumber: {
        type: String,
        unique: true,
    },
    fuelType: {
        type: String,
        enum: ['petrol', 'diesel', 'electric'],
        default: null,
    },
    timestamp: {
        type: Date,
        default: null,
    },
});

const ParkingSlot = mongoose.model('ParkingSlot', ParkingSlotSchema);
module.exports = ParkingSlot;