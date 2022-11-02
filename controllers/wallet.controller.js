const Wallet = require("../models/wallet");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");

exports.walletSignUp = async (req,res)=>{
    // input
    const {username,email,password,role}=req.body;
    try {
        // validating input
        if(!(username&&email&&password)){
         return res.status(400).json("Input all fields");
        };
        // Generating and Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        // Create wallet
        const wallet = await Wallet.create({
           username,
           email,
           password:hashPassword,
           role, 
        });
        return res
      .status(200)
      .json({ message: "Wallet created successfully", wallet:wallet });
    } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ error: error.keyValue, message: "email already exists" }); 
    }
};

exports.walletLogin = async (req,res)=>{
  // login input
  const {email,password}= req.body;
  try {
    // validating input
    if(!(email&&password)){
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // checking if wallet exist
    const walletExists =await Wallet.findOne({email});
    if (!walletExists){
      return res.status(404).json({
          message: "Wallet doesn't exists",
      });
  };
  // if exist go on to check for password
  const checkPassword = await bcrypt.compare(password,walletExists.password);
  if(!checkPassword){
    return res.status(401).json({ message: "invalid credentials" });
  }
  // if correct tokenize the payload
  const payload = {_id:walletExists._id};
  const token = await jwt.sign(payload,process.env.SECRET_KEY,{
    expiresIn:"1d",
  });
  res.cookie ("access_token",token);
  return res
      .status(202)
      .json({ message: "Wallet logged in successfully", token: token });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "internal server error" });
  }
};


exports.adminWalletLogin = async (req,res)=>{
  try {
    const {email,password,role}=  req.body;
    if(!email&&!password&&!role){
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const walletExists =await Wallet.findOne({email});
    if (!walletExists){
      return res.status(404).json({
          message: "Wallet doesn't exists",
      });
  };
  // if exist go on to check for password
  const checkPassword = await bcrypt.compare(password,walletExists.password);
  if(!checkPassword){
    return res.status(401).json({ message: "invalid credentials" });
  }
  // if correct tokenize the payload
  const payload = {_id:walletExists._id};
  const token = await jwt.sign(payload,process.env.SECRET_KEY,{
    expiresIn:"1d",
  });
  res.cookie ("access_token",token);
  return res
      .status(202)
      .json({ message: "Wallet logged in successfully", token: token });

  } catch (error) {
    return res
    .status(500)
    .json({ error: error.message, message: "internal server error" });

  }
 };


 exports.allWallet= async(req,res)=>{
  try {
      const wallet = await Wallet.find();
        return res.status(200).json({
      status: true,
      message: 'All Wallet retrieved successfully',
      wallet
    });
  } catch (err) {
      return res.status(500).json({
          status: false,
          message: `Unable to retrieve all wallet. Please try again. \n Error: ${err}`,
        }); 
  }
};


