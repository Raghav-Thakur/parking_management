const Wallet = require('../models/walletModel');
const User = require('../models/userModel'); // Import the User model

// Get wallet details by email
const getWallet = async (req, res) => {
    const { email } = req.body; // Get email from request body
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Find the wallet using the user's ID
        const wallet = await Wallet.findOne({ user: user._id });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add money to wallet by email
const addMoney = async (req, res) => {
    const { email, amount } = req.body; // Get email and amount from request body
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Update or create the wallet
        const wallet = await Wallet.findOneAndUpdate(
            { user: user._id },
            { $inc: { balance: amount } },
            { new: true, upsert: true } // Create wallet if it doesn't exist
        );
        res.status(200).json({ message: "Money added successfully", new_balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Deduct money from wallet by email
const deductMoney = async (req, res) => {
    const { email, amount } = req.body; // Get email and amount from request body
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Find the wallet using the user's ID
        const wallet = await Wallet.findOne({ user: user._id });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        if (wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }
        wallet.balance -= amount;
        await wallet.save();
        res.status(200).json({ message: "Money deducted successfully", new_balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getWallet, addMoney, deductMoney };