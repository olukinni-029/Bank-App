const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Transaction = require("../models/transaction");
const Wallet = require("../models/wallet");
const { creditAccount, debitAccount } = require("../utils/trnx.util");

exports.walletDeposit = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { username, amount, summary } = req.body;
    const reference = v4();

    if (!username && !amount && !summary) {
      return res.status(400).json({
        message:
          "Please provide the following details: username, amount, summary",
      });
    }

    const depositResult = await creditAccount({
      amount,
      username: username,
      purpose: "deposit",
      reference,
      summary,
      trnxSummary: `DEPOSIT INTO: ${username}. TRNX REF:${reference} `,
      session,
    });

    if (depositResult.status !== true) {
      await session.abortTransaction();
      session.endSession();
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: "Deposit successful",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: false,
      message: `Unable to find perform deposit. Please try again. \n Error: ${err}`,
    });
  }
};

exports.walletWithdrawal = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { username, amount, summary } = req.body;
    const reference = v4();
    if (!username && !amount && !summary) {
      return res.status(400).json({
        message:
          "Please provide the following details: username, amount, summary",
      });
    }
    const withdrawResult = await debitAccount({
      amount,
      username,
      purpose: "withdrawal",
      reference,
      summary,
      trnxSummary: `WDRW FROM: ${username}. TRNX REF:${reference} `,
    });
    if (withdrawResult.status !== true) {
      await session.abortTransaction();
      session.endSession();
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: "Withdrawal successful",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
  }
};

exports.allWalletWithdrawal = async (req, res) => {
  const { trnxType = "DR" } = req.params;
  try {
    const id = req.wallet._id;
    const wallet = await Wallet.findOne({ _id: id });
if (wallet.role !== "admin") {
      return res.status(401).json({ message: "You are not authorized" });
    }
    const transaction = await Transaction.find({ trnxType });
    return res.status(200).json({
      status: true,
      message: "All successful withdrawal",
      transaction,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to retrieve all withdrawal transaction. Please try again. \n Error: ${err}`,
    });
  }
};

exports.allWalletDeposit = async (req, res) => {
  const { trnxType = "CR" } = req.params;
  try {
    const id = req.wallet._id;
    const wallet = await Wallet.findOne({ _id: id });
if (wallet.role !== "admin") {
      return res.status(401).json({ message: "You are not authorized" });
    }
    const transaction = await Transaction.find({ trnxType });
    return res.status(200).json({
      status: true,
      message: "All successful deposit",
      transaction,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to retrieve all deposit transaction. Please try again. \n Error: ${err}`,
    });
  }
};
