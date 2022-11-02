const mongoose =require("mongoose");

const walletSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        immutable:true,
        unique:[true,"Username already exist"],
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    balance: {
        type: mongoose.Decimal128,
        required: true,
        default: 0.00
    },
},
{timestamps:true,
versionKey:false}
);

module.exports = mongoose.model("Wallet",walletSchema);