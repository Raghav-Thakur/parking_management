const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: { type: Number, required: true },
  isOccupied: { type: Boolean, default: false },
  vehicleType: { type: String, default: null },
  vehicleNumber: { type: String, default: null }, // Remove `unique: true` here
  fuelType: { type: String, default: null },
  startTime: { type: Date, default: null },
  endTime: { type: Date, default: null },
  userEmail: { type: String, default: null },
});

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);
