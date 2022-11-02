const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");

const creditAccount = async ({
    amount,
    username,
    purpose,
    reference,
    summary,
    trnxSummary,
    session,
  }) =>{
  const wallet = await Wallet.findOne({ username });
    if (!wallet) {
      return{
        status:true,
        statusCode:404,
        message: `Wallet ${username} doesn't exist`,
    };
  }

    const updatedWallet = await Wallet.findOneAndUpdate(
      { username },
      { $inc: { balance: amount } },
      { session }
    );

    const transaction = await Transaction.create(
      [
        {
          trnxType: "CR",
          purpose,
          amount,
          username,
          reference,
          balanceBefore: Number(wallet.balance),
          balanceAfter: Number(wallet.balance) + Number(amount),
          summary,
          trnxSummary,
        },
      ],
      { session }
    );
    return{
      status:true,
      statusCode:201,
        message: "Credit successful",
        data: { updatedWallet, transaction },
    };
  };

const debitAccount = async ({
  amount,
    username,
    purpose,
    reference,
    summary,
    trnxSummary,
    session,
  }) =>{
  const wallet = await Wallet.findOne({ username });
    if (!wallet) {
      return{
        status:true,
        statusCode:404,
        message: `Wallet ${username} doesn't exist`,
    };
  }

    if (Number(wallet.balance) < amount) {
      return{
      status:false,
      statusCode:400,
      message: `User ${username} has insufficient balance`,
    };
  }

    const updatedWallet = await Wallet.findOneAndUpdate(
      { username },
      { $inc: { balance: - amount } },
      { session }
    );
    const transaction = await Transaction.create(
      [
        {
          trnxType: "DR",
          purpose,
          amount,
          username,
          reference,
          balanceBefore: Number(wallet.balance),
          balanceAfter: Number(wallet.balance) - Number(amount),
          summary,
          trnxSummary,
        },
      ],
      { session }
    );
    
    return{
      status:true,
      statusCode:201,
      message: "Debit successful",
        data: { updatedWallet, transaction },
  };
}; 
  module.exports={
    creditAccount,debitAccount,
  };
