
const bcrypt=require("bcrypt");
const config=require("config");
 const cookie=require("cookie-parser");
const jwt=require("jsonwebtoken");
const usermodel=require("../models/user_model");
const {generateToken}= require("../utils/generatetoke");


module.exports.registeruser= async function(req,res){
   try{
    let {email,fullname,password}=req.body;//i can use joy package so that ican ask for mandetory
 let user=await usermodel.findOne({email:email});
 if(user) {
  req.flash("error","u have an account");
  res.redirect("/");
  return ;
    //  return res.status(401).send("user is already been there");
 }
      bcrypt.genSalt(10,function(err,salt){
             bcrypt.hash(password,salt,async function(err,hash){
               
                const user=await usermodel.create({
                    fullname,
                    email,
                    password:hash,
                  });
                
            const token=generateToken(user);
                 res.cookie("token",token);
                res.redirect("/shop");
               return ;
             });
      }); 
    
      
   }
   catch(err){
        console.log(err.message);
   }
   }


   module.exports.loginuser= async function(req,res){
     let {email,password}=req.body;
      
    let user= await usermodel.findOne({email:email});
     if(!user){ req.flash("error","email or password are incorrect");
      return res.redirect("/");
     }

     bcrypt.compare(password,user.password,function(err,result){
      
        if(result) {
            let token= generateToken(user);
            res.cookie("token",token);
            res.redirect("/shop");
           
        }else{
            req.flash("error","email or password  incorrect");
            return res.redirect("/");
        }
        
     })


     
   }


   module.exports.logout=function(req,res){
      res.cookie("token","");
      res.redirect("/");
   }