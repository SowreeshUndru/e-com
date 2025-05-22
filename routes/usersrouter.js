const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const isloggedin = require("../middleware/isloggedin")
const { registeruser, loginuser } = require("../controllers/authcontroller");
const usermodel = require("../models/user_model");
const Product = require("../models/product_model");
const { generateToken } = require("../utils/generatetoke");
router.get("/", function (req, res) {
   res.send("hey its working in users");
});
// const error="";
// router.get("/logout", function (req, res) {
//    res.render("index",{error});
// });

router.get('/payment', (req, res) => {
   res.render('payment');
});
router.post('/confirm-payment', (req, res) => {
   const { paymentMethod, name, card, expiry, cvv, upiId } = req.body;

   if (paymentMethod === 'card') {
      // Validate and process card
   } else if (paymentMethod === 'upi') {
      // Validate and process UPI
   } else if (paymentMethod === 'cod') {
      // Just place order with cash option
   }

   res.render('payment-success');
});
router.post("/register", registeruser);
router.post("/login", loginuser);

router.get('/product/:id', async (req, res) => {
   const productId = req.params.id;
   const product = await Product.findById(productId);
   if (!product) {
      return res.status(404).send('Product not found');
   }
   res.render('productdetail', { product });
});

router.post('/cart/update/:id', (req, res) => {
   const { id } = req.params;
   const action = req.body.action;
   const cart = req.session.cart || [];

   const item = cart.find(p => p._id === id);
   if (item) {
      if (action === 'increase') {
         item.quantity = (item.quantity || 1) + 1;
      } else if (action === 'decrease') {
         item.quantity = (item.quantity || 1) - 1;
         if (item.quantity <= 0) {
            // Optional: Remove item if quantity goes to 0
            req.session.cart = cart.filter(p => p._id !== id);
            return res.redirect('/shop/cart');
         }
      }
   }

   req.session.cart = cart;
   res.redirect('/shop/cart');
});


// Ensure express, usermodel, etc. are already imported as shown above

// Ensure express, usermodel, etc. are already imported as shown above

router.post("/cart/remove/:id", isloggedin, async (req, res) => {
   try {
      const email = req.user.email; // Or however you're storing logged-in user's ID in session
      const productId = req.params.id;
console.log(email);
      if (!email) {
         return res.redirect("/users/login");
      }

      // Remove the product from the user's cart
      await usermodel.findOneAndUpdate(
  { email: email },
  { $pull: { cart:productId } }
);


      res.redirect("/shop/cart");
   } catch (err) {
      console.error("Error removing item from cart:", err);
      res.status(500).send("Something went wrong.");
   }
});

router.post("/ask-question/:id", async (req, res) => {
  const { id } = req.params;
  const { question } = req.body;

  try {
    await Product.findByIdAndUpdate(id, {
      $push: {
        questions: { question: question, answer: "" } // blank answer for now
      }
    });
    res.redirect(`/users/product/${id}`);
  } catch (err) {
    console.error("Error saving question:", err);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;




module.exports = router;  