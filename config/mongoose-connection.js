const mongoose = require("mongoose");
const  config=require("config");
const dbgr=require("debug")("development:mongoose");
mongoose
.connect(`${process.env.MONGODB_URI}`)
    .then(function(){
         console.log("mongodb connected");
    })
    .catch(function(err){
      dbgr(err);
    })


 module.exports=mongoose.connection;