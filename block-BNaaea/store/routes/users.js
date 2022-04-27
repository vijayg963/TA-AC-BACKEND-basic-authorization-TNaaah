var express = require("express");
const User = require("../models/users");
var router = express.Router();
const Users = require("../models/users");
const bcrypt = require("bcrypt");
const app = require("../app");
const { findOneAndUpdate } = require("../models/users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// To register a new user render the new user
router.get("/register/new", (req, res) => {
  res.render("registeruser");
});

//create a user
router.post("/register", async function (req, res) {
  try {
    let user = await Users.create(req.body);
    if (user) {
      res.send("user is created sucessfully");
    }
  } catch (err) {
    res.send(err);
  }
});

// get  the login form  to  so the user can  submit his/her detail
router.get("/login", (req, res) => {
  let notregistered = req.flash("notregistered");
  let notmatched = req.flash("notmatched");
  let requiredboth = req.flash("requiredboth");
  let emailrequired = req.flash.emailrequired;
  let passwordrequired = req.flash.passwordrequired;
  let blocked = req.flash.blocked;

  return res.render("usersignup", {
    noemail: notregistered,
    notmatched: notmatched,
    requiredboth: requiredboth,
    emailrequired: emailrequired,
    passwordrequired: passwordrequired,
    blocked : blocked
  });
});
//both required , passwordrequired , emailrequired , wrongpassword
//login a user as a admin or a normal user
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await Users.findOne({ email });
    // if both the email  and  the password is not passed then
    if (password.length === 0 && email.length === 0) {
      req.flash("requiredboth", "email and password both are requierd ");
      return res.redirect("/users/login");
    }
    //if the email is not passed
    if (!email) {
      req.flash("emailrequired", "email is required");
      return res.redirect("/users/login");
    }

    // if the password is not passed by the user
    if (!password) {
      req.flash("passwordrequired", "password is required");
      return res.redirect("/users/login");
    }
    // if the user is not
    //  found in the database means the user is not registered then
    if (!user) {
      req.flash("notregistered", "user is not registered on this email");
      return res.redirect("/users/login");
    }

    let isMatched = await bcrypt.compare(req.body.password, user.password);
    // if  the password is  not matched  then
    if (!isMatched) {
      req.flash("notmatched", "password  is not matched");
      return res.redirect("/users/login");
    }
    if(user.isblocked ===true){
      req.flash("blocked", "sorry you are blocked");
      return res.redirect("/users/login");
    }
    if (isMatched) {
      req.session.userId = user._id;
      // console.log('This is the session object'+req.session.userId);
      return res.redirect("/products");
    }
    return res.redirect("/products");
  } catch (err) {
    console.log(err);
  }
});
// logout user clear the cookies on the client side as well as destroy the session on
// the server  side  so the user  session is completely removed

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});


// to block or unblock a normal user 
// /users/<%= cv._id%>/block
router.get('/:id/block', async (req ,res)=>{
  try{
    let userId = req.params.id;
    let user = await User.findByIdAndUpdate( userId ,{$set :{isblocked : true}}, {new : true});
    if(user){
      res.redirect('/products?alluser=user');
    }
  }
  catch(err){
    console.log("not updated ");
    res.redirect('/products?alluser=user');
  }
})
//unblock the user
router.get('/:id/unblock', async (req ,res)=>{
  console.log('coming inside  this one');
  let userId = req.params.id;
  try{
    let user = await User.findByIdAndUpdate( userId ,{$set :{isblocked :false}}, {new : true});
    if(user){
      res.redirect('/products?alluser=user');
    }
  }
  catch(err){
    res.redirect('/products?alluser=user');
  }
})
module.exports = router;
