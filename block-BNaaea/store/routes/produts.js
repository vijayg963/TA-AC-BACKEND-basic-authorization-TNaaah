var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('produts');
});

router.get('/new', function (req, res, next) {
  res.render('addProduts');
});

router.post('/', function (req, res, next) {
  console.log(req.body);
  res.render('produts');
});

module.exports = router;
