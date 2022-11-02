require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");

const walletRoute = require("./routes/wallet.route");
const transactionRoute = require("./routes/trnx.route");


const app = express();
connectDB();

app.use(express.json());



app.get("/",(req,res)=>{
    res.status(200).json({message:"ABBank App"});
});

app.use("/api",walletRoute);
app.use("/api",transactionRoute)

const port=process.env.PORT ||4500;

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}.`);
});


