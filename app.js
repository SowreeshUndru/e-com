require('dotenv').config(); 

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expresssession=require("express-session");
const flash=require("connect-flash");
const { setEngine } = require("crypto");
const   db=require(path.join(__dirname,"config/mongoose-connection.js"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(expresssession({
 resave:false,
 saveUninitialized:false,
 secret:process.env.EXPRESS_SESSION_SECRET,
}));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine","ejs")
const ownersrouter=require(path.join(__dirname,"routes/ownersrouter.js"));
const usersrouter=require(path.join(__dirname,"routes/usersrouter.js"));
const indexrouter=require(path.join(__dirname,"routes/index.js"))
const productsrouter=require(path.join(__dirname,"routes/productsrouter.js"));
app.use("/",indexrouter);
app.use("/owners",ownersrouter);
app.use("/users",usersrouter);
app.use("/products",productsrouter);



app.listen(3000, function (err) {
    if (err) {
        console.log(err);
    }
    console.log("running at port 3000");

});