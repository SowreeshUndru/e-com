const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
  image:Buffer ,
  name:String,
  price:Number,
  discount:{
    type:Number, default:0
  },
  bgcolor:String,
  panel:String,
  textcolor:String,
  rated:{
    type:Number,
    default:0
  },
  questions:[
    {
      question:{
        type:String,
      },
      answer:{
        type:String,
      }
    }
  ]
     
});
module.exports =mongoose.model("product",productschema);