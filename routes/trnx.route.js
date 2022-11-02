const express = require('express');
const { walletDeposit, walletWithdrawal, allWalletWithdrawal, allWalletDeposit } = require('../controllers/trnx.controller');
const {isAuth} = require('../middleware/isAuth');
const router = express.Router();



router.post('/deposit',walletDeposit);
router.post('/withdraw',walletWithdrawal);
router.get('/withdraw',isAuth,allWalletWithdrawal);
router.get('/deposit',isAuth,allWalletDeposit);

module.exports = router;