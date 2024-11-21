const express = require('express');
const { getWallet, addMoney, deductMoney } = require('../controllers/walletController');

const router = express.Router();

router.get('/', getWallet); // No authentication
router.post('/add', addMoney); // No authentication
router.post('/deduct', deductMoney); // No authentication

module.exports = router;