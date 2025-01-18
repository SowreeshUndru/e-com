const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    fullname: String,
    email: String,
    cart: { type: Array, default: [] },
    password:String,
    isadmin: Boolean,
    orders: { type: Array, default: [] },
    contact: Number,
    picture: Buffer,
     
});
module.exports =mongoose.model("user",userschema);