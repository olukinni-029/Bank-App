const express = require("express");
const {
  walletSignUp,
  walletLogin,
  allWallet,
  adminWalletLogin,
} = require("../controllers/wallet.controller");
const { isAuth } = require("../middleware/isAuth");
const router = express.Router();

router.post("/signup", walletSignUp);
router.post("/login", walletLogin);
router.get("/",isAuth, allWallet);
router.post("/adminLogin", isAuth, adminWalletLogin);


module.exports = router;
