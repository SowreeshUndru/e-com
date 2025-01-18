const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
  image:String ,
  name:String,
  price:Number,
  discount:{
    type:number, default:0
  },
  bgcolor:String,
  panel:String,
  textcolor:String
     
});
module.exports =mongoose.model("products",productschema);