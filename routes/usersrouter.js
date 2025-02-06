const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { registeruser, loginuser } = require("../controllers/authcontroller");
const usermodel = require("../models/user_model");
const { generateToken } = require("../utils/generatetoke");
router.get("/", function (req, res) {
   res.send("hey its working in users");
});
// const error="";
// router.get("/logout", function (req, res) {
//    res.render("index",{error});
// });


router.post("/register", registeruser);
router.post("/login", loginuser);
module.exports = router;  