const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../config/multerconfig");
const ownermodel = require("../models/owners_model");
const productmodel = require("../models/product_model");
const ownerIsLoggedIn = require("../middleware/ownerisloggedin");

// GET: Home page (Login/Signup)
router.get("/", function (req, res) {
  const success = req.flash("success");
  const error = req.flash("error");
  res.render("owners_home", { success, error });
});

// POST: Signup
router.post("/create", upload.single("picture"), async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existing = await ownermodel.findOne({ email });
    if (existing) {
      req.flash("error", "Email already exists");
      return res.redirect("/owners");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = await ownermodel.create({
      fullname,
      email,
      password: hashedPassword,
      picture: req.file ? req.file.buffer : null,
    });

    const token = jwt.sign({ email: newOwner.email }, process.env.JWT_KEY);
    res.cookie("token", token);

    req.flash("success", `Welcome ${newOwner.fullname}`);
    res.redirect("/owners/admin/products");
  } catch (err) {
    console.error("Signup error:", err);
    req.flash("error", "Something went wrong during signup.");
    res.redirect("/owners");
  }
});

// POST: Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const owner = await ownermodel.findOne({ email });
    if (!owner) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/owners");
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/owners");
    }

    const token = jwt.sign({ email: owner.email }, process.env.JWT_KEY);
    res.cookie("token", token);

    req.flash("success", `Welcome ${owner.fullname}`);
    res.redirect("/owners/admin/products");
  } catch (err) {
    console.error("Login error:", err);
    req.flash("error", "Login failed");
    res.redirect("/owners");
  }
});

// GET: Redirect to products admin
router.get("/admin", ownerIsLoggedIn, (req, res) => {
  res.redirect("/owners/admin/products");
});

// GET: List all products
router.get("/admin/products", ownerIsLoggedIn, async (req, res) => {
  try {
    const products = await productmodel.find();
    const success = req.flash("success");
    const error = req.flash("error");
    res.render("products_list", { products, success, error });
  } catch (err) {
    console.error("Load products error:", err);
    req.flash("error", "Failed to load products");
    res.redirect("/owners/admin");
  }
});

// GET: Create product page
router.get("/admin/products/create", ownerIsLoggedIn, (req, res) => {
  const error = req.flash("error");
  res.render("createproducts", { error });
});

// POST: Create a new product
router.post("/admin/products/create", ownerIsLoggedIn, upload.single("image"), async (req, res) => {
  try {
    const { name, price, discount, bgcolor, panel, textcolor } = req.body;

    const newProduct = new productmodel({
      name,
      price,
      discount: discount || 0,
      bgcolor,
      panel,
      textcolor,
      image: req.file ? req.file.buffer : null,
    });

    await newProduct.save();
    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin/products");
  } catch (err) {
    console.error("Create product error:", err);
    req.flash("error", "Failed to create product");
    res.redirect("/owners/admin/products/create");
  }
});

// POST: Delete a product
router.post("/admin/products/:id/delete", ownerIsLoggedIn, async (req, res) => {
  try {
    await productmodel.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted successfully");
    res.redirect("/owners/admin/products");
  } catch (err) {
    console.error("Delete product error:", err);
    req.flash("error", "Failed to delete product");
    res.redirect("/owners/admin/products");
  }
});

// GET: Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
