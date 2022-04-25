var express = require('express');
var router = express.Router();

const Register = require('../model/register');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('produts');
});

// login form
router.get('/login', function (req, res, next) {
  var error = req.flash('error')[0];
  console.log(error);
  res.render('login', { error });
});

router.get('/register', function (req, res, next) {
  res.render('register', { error: req.flash('error')[0] });
});

router.post('/register', function (req, res, next) {
  Register.create(req.body, (err, user) => {
    // console.log(err);
    if (err) {
      if (err.name === 'MongoError') {
        req.flash('error', 'This email is taken');
        return res.redirect('/users/register');
      }
      if (err.name === 'validationError ') {
        req.flash('error', err.message);
        return res.redirect('/users/register');
      }
      return res.json({ err });
    }
    res.redirect('/users/login');
  });
});

router.post('/login', function (req, res, next) {
  var { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    req.flash('error', 'Email/Password required');
    return res.redirect('/users/login');
  }
  Register.findOne({ email }, (err, user) => {
    if (err) return next(err);
    // no user
    if (!user) {
      req.flash('error', 'This email is not registered');
      return res.redirect('/users/login');
    }
    // campare password
    user.verifyPassword(password, (err, result) => {
      console.log(err, result);
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Incorrect password');
        return res.redirect('/users/login');
      }
      // parsist logged in user information
      req.session.userId = user.id;
      res.redirect('/produts');
    });
    0;
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  return res.redirect('/users/login');
});

module.exports = router;
