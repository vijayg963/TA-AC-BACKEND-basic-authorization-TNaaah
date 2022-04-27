let User = require("../models/users");
module.exports = {
    isUserLoggedIn: (req, res, next) => {
    if (req.session.userId) {
       return next();
    } else {
      res.redirect('/users/login');
    }
  },
  userInformation: async (req, res, next) => {
    try {
      let userId = req.session.userId.toString();
      if (userId) {
        let user = await User.findById(userId, "name email isadmin");
        req.user = user;
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
    let isAdmin = req.user.isAdmin;
    if (isAdmin === true) {
      next();
    }
    return res.redirect("/products");
  },
};
