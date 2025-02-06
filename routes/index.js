const express = require("express");
const router = express.Router();
const productmodel=require("../models/product_model");
const usermodel=require("../models/user_model")
const isloggedin=require("../middleware/isloggedin");
router.get("/",function(req,res){
    let error=req.flash("error");
 res.render("index",{error,loggedin:false});
});

router.get("/shop",isloggedin,async function(req,res){
   
   const products=await productmodel.find();
 const success= req.flash("success");
   res.render('shop', { products ,success});
    
});

router.get("/shop/cart",isloggedin,async function(req,res){

    try {
        const user = await usermodel.findOne({ email: req.user.email }).populate("cart");
        res.render("cart", { cart: user.cart });
    } catch (error) {
        console.error("Error loading cart:", error);
        req.flash("error", "Unable to load cart.");
        res.redirect("/shop");
    }
   
    
    
     
 });
router.get("/addtocart/:productid",isloggedin,async function(req,res){
    console.log("Authenticated user:", req.user);
    let user=await usermodel.findOne({email:req.user.email})
    if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/");
    }
    
   
    user.cart.push(req.params.productid) ;
  
 await user.save();
 req.flash("success","item is added into cart");
 
 return res.redirect("/shop");
     
 });

module.exports=router;




