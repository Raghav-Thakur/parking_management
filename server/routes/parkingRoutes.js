const express = require('express');
const parkingController = require('../controllers/parkingController');

const router = express.Router();

// Initialize parking slots (call this when the server starts)
// parkingController.initializeParkingSlots();

// Allot a parking slot
router.post('/allot', parkingController.allotParkingSlot);

// Deallocate a parking slot
router.post('/deallocate/:slotNumber', parkingController.deallocateParkingSlot);

router.get('/slots', parkingController.getAllParkingSlots);

module.exports = router;