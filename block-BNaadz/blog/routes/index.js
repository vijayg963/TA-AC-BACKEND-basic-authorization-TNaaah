var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('user is  logged in user  ' + req.session.userId);
  res.render('index', { title: 'Express' });
});

module.exports = router;
