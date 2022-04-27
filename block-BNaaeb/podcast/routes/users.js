var express = require("express");
var router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const auth = require("../middelwares/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// to create a new user
router.get("/register/new", (req, res) => {
  res.render("registeruser");
});
// to create the new account
router.post("/register", async (req, res) => {
  try {
    let user = await User.create(req.body);
    if (user) {
      req.session.userId = user._id;
    }
  } catch (err) {
    console.log(err);
    res.redirect("/users/register/new");
  }
});

router.get("/login", (req, res) => {
  let notregistered = req.flash("notregistered");
  let notmatched = req.flash("notmatched");
  let requiredboth = req.flash("requiredboth");
  let emailrequired = req.flash("emailrequired");
  let passwordrequired = req.flash("passwordrequired");

  return res.render("userlogin", {
    noemail: notregistered,
    notmatched: notmatched,
    requiredboth: requiredboth,
    emailrequired: emailrequired,
    passwordrequired: passwordrequired,
  });
});
// post request on  the /users/login  to login the user  and check the user detail with
// the database
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
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
    if (isMatched) {
      req.session.userId = user._id;
      // console.log('This is the session object'+req.session.userId);
      return res.redirect("/");
    }
    return res.redirect("/");
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
module.exports = router;
