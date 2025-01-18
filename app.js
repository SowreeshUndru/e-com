const express=require("express");
const app=express();

app.listen(3000,function(err){
    if(err){
 console.log(err);
    }
    console.log("running at port 3000");

})