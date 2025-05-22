const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owners_model");

const ownerIsLoggedIn = async function (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/owners");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const owner = await ownerModel.findOne({ email: decoded.email }).select("-password");

    if (!owner) {
      req.flash("error", "Owner not found.");
      return res.redirect("/owners");
    }

    req.owner = owner;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    req.flash("error", "Session expired or invalid token.");
    return res.redirect("/owners");
  }
};

module.exports = ownerIsLoggedIn;
