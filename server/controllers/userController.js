const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    // Basic validation
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); // Adjust salt rounds as needed
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
        });

        // Save the new user
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Retrieve all users from the database
        const users = await User.find();

        // Check if users exist
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Return the list of users
        return res.status(200).json({ message: 'Users retrieved successfully', users });
    } catch (error) {
        // Handle any errors that occur
        console.error('Error retrieving users:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, getAllUsers };
