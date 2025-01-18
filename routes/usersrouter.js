const express=require("express");
const router=express.Router();
router.get("/",function(req,res){
 res.send("hey its working in users");
});
module.exports=router; 