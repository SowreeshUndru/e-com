const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    fullname: String,
    email: String,
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref:"product" }],
    password:String,
    
    orders: { type: Array, default: [] },
    contact: Number,
    picture: Buffer
     
});
module.exports =mongoose.model("user",userschema);