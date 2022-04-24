var login = require('../model/login');

module.exports = {
  loggedInUser: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.redirect('/login');
    }
  },

  userInfo: (req, res, next) => {
    var userId = req.session && req.session.userId;
    if (userId) {
      login.findById(userId, 'name email', (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
      });
    }
  },
};
