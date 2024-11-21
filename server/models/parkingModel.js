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
});

const ParkingSlot = mongoose.model('ParkingSlot', ParkingSlotSchema);
module.exports = ParkingSlot;