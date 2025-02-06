const mongoose = require("mongoose");

const ownerschema = new mongoose.Schema({
    fullname: {
        type:String,
        required:true,
    },
    email: String,
    password:String,
    products:{
        type:Array,
        default:[]
    },
    picture: Buffer
     
});
module.exports =mongoose.model("owner",ownerschema);