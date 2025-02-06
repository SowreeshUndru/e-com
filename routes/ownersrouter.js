const express = require("express");
const router = express.Router();

const ownermodel = require("../models/owners_model");

router.get("/", function (req, res) {
    res.send("hey its working");
});
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "development") {

    router.post("/create",  async function (req, res) {
        const owners = await ownermodel.find();
        if (owners.length < 0) {
            return res.status(503).send("You don't have permissions to create a new owner");
        }
        const { fullname, email, password } = req.body;
        const createdOwner = await ownermodel.create({ fullname, email, password });
        res.status(201).send(createdOwner);
    });
    

}

router.get("/admin",function (req,res){
   let success= req.flash("success");
    res.render('createproducts', { success });
});
module.exports = router; 