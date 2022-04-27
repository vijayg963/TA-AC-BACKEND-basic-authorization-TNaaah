const User = require("../models/users");
module.exports = {
  isUserLoggedIn: (req, res, next) => {
    if (req.session.userId) {
      return next();
    } else {
      res.redirect("/users/login");
    }
  },
  userInformation: async (req, res, next) => {
    try {
      let userId = req.session.userId.toString();
      console.log(userId);
      if (userId) {
        let user = await User.findById(userId, "name email isadmin isverified");
        req.user = user;
        console.log("this is the middelware folder auth");
        console.log(user);
        res.locals.user = user;
        next();
      }
    } catch (err) {
      req.user = false;
      res.locals.user = false;
      next();
    }
  },
  isadmin: (req, res, next) => {
    let isAdmin = req.user.isadmin;
    
    if (isAdmin === true) {
      next();
    }
    return res.redirect("/users/login");
  },
  isverified: (req, res, next) => {
    console.log(req.user.isverified);
    if (req.user.isverified === true) {
      next();
    } else {
      res.redirect("/users/login");
    }
  },
};
