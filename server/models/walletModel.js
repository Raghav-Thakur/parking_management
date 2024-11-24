const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true, // Ensure each email has a unique wallet
    },
    balance: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Wallet', walletSchema);