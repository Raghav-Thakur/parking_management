const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define the POST route for user registration
router.post('/register', userController.registerUser );

module.exports = router;