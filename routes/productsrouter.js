const express=require("express");
const router=express.Router();
const upload=require("../config/multerconfig")
const productmodel=require("../models/product_model");
const success="";
router.get("/",function(req,res){
 res.render("createproducts",{success:success});
});
 router.post("/create",upload.single("image"), async function(req,res){
   const {name,
    price,
    discount,
    bgcolor,
    panel,
    textcolor}=req.body;
    
    
    try{
        let product= productmodel.create({
            image:req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panel,
            textcolor
        })  ;
        req.flash("success","product successfully created. ");
      return   res.redirect("/owners/admin");
    }catch{
        req.flash("error","something went wrong");
    }
 });


module.exports=router; 





// image:Buffer ,
//   name:String,
//   price:Number,
//   discount:{
//     type:number, default:0
//   },
//   bgcolor:String,
//   panel:String,
//   textcolor:String