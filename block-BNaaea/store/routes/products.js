const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Products = require("../models/product");
const User = require("../models/users");
const Category = require("../models/category");
const auth = require("../middlewares/auth");
const { runInNewContext } = require("vm");
const Product = require("../models/product");

const uploadPath = path.join(__dirname, "../public/uploads/");
console.log(uploadPath);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//get  the all products  page once the user is login  or the user is a admin
// both admin and normal user can access this page
router.get("/", auth.isUserLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    let user = await User.findById(userId);
    let allproducts = await Products.find({});
    let allCategories = await Category.find({});
    let allUsers = await User.find({isadmin : false});
    // all the distnict categorires  
    let distnictCategories  = [... new Set(allCategories.map(cv => cv.name))];
    if(!user.isadmin){
      return res.render("products", {
        products: allproducts,
        categoriesproducts :false,
      });
    }
  
    if(user.isadmin){
      if(req.query.category){
        let categoriesProducts = await Category.find({name :req.query.category}).populate('productId');
        return res.render("adminDashboard", {
          products :false,
          categoriesproducts: categoriesProducts, 
          categories: distnictCategories,
          users  : false,
        });
      }
      if(req.query.alluser){
        let users = await User.find({isadmin : false});
        console.log(users);
        return res.render("adminDashboard", {
          products :false,
          categoriesproducts: false, 
          categories: distnictCategories,
          users  : users,
        });
      }
      return res.render("adminDashboard", {
        products: allproducts,
        categoriesproducts: false,
        categories: distnictCategories,
        users  : allUsers
      });
    }
  } catch (err) {
    return res.redirect("/products");
  }
});



// only  logged in admin/ user can add a product
router.get("/new", auth.isUserLoggedIn, async (req, res) => {
  try {
    return res.render("addproduct");
  } catch (err) {
    return res.redirect("/products");
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    let categoryData = {};
    categoryData.name = req.body.category;
    req.body.category = [];
    req.body.image = req.file.filename;
    let product = await Products.create(req.body);
    categoryData.productId = product._id;
    // add the category to the  category collection along with the product id
    let category = await Category.create(categoryData);
    // now update  the product collection by adding  the category id
    let updateProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { category: category._id },
      },
      { new: true }
    );
    if (updateProduct) {
      return res.redirect("/products");
    }
  } catch (err) {
    res.redirect("/products/new");
  }
});

// edit a product
router.get("/edit/:id", auth.isadmin, async (req, res) => {
  try {
    // checking if the user is admin then only move forward
    let id = req.params.id;
    let product = await Products.findById(id);
    res.render("editproduct", { product: product });
  } catch (err) {
    res.redirect("/products");
  }
});
// now edit  the product
router.post("/:id", upload.single("image"), async (req, res) => {
  try {
    console.log("coming inside the products to edit  this product");
    let id = req.params.id;
    req.body.image = req.file.filename;
    let product = await Products.findByIdAndUpdate(id, req.body, { new: true });
    console.log("we are here updating  the products" + product);
    res.redirect("/products");
  } catch (err) {
    res.redirect("/products");
  }
});

// delete the product  only author can delete it
router.get("/:id/delete", auth.isadmin, async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Products.findByIdAndDelete(id, { new: true });
    console.log('Deleted the product  and the product is ');
    console.log(product);
    res.redirect("/products");
  } catch (err) {
    res.redirect("/products");
  }
});

// like the product only user can like the product
router.get("/:id/like", auth.isUserLoggedIn, async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Products.findByIdAndUpdate(
      id,
      { $inc: { likes: +1 } },
      { new: true }
    );
    res.redirect("/products");
  } catch (err) {
    res.redirect("/users/login");
  }
});

//dislike the product
// router.get("/:id/dislike", async (req, res) => {
//   try {
//     let id = req.params.id;
//     let userid = req.session.userId;
//     let user = await User.findById(userid);
//     if (user.isadmin === ture) {
//       let product = await Products.findById(id);
//       if (product.likes > 0) {
//         let product = await Products.findByIdAndUpdate(id, {
//           $inc: { likes: -1 },
//         });
//         return res.redirect("/products");
//       }
//       res.redirect("/products");
//     }
//     res.redirect("/user/login");
//   } catch (err) {
//     res.redirect("/products");
//   }
// });

module.exports = router;
