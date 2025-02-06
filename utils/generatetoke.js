const jwt=require("jsonwebtoken");
const config=require("config");
const dotenv=require("dotenv").config();
function generateToken(user){
    let token=   jwt.sign({email:user.email,id: user._id},process.env.JWT_KEY,{expiresIn:'1h'});
    return token;
};


module.exports.generateToken=generateToken;