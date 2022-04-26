const User = require('../model/users');
module.exports = {
  isUserLogged: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.redirect('/users/login');
    }
  },
  userinfo: async (req, res, next) => {
    let userId = req.session.userId;
    if (userId) {
      let user = await User.findById(userId, ' name email');
      req.user = user;
      res.locals.user = user;
      next();
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};
