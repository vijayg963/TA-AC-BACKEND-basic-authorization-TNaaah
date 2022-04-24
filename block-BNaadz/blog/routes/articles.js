var express = require('express');
var router = express.Router();

var Article = require('../model/article');

/* GET users listing. */
router.get('/', function (req, res, next) {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render('articles', { articles });
  });
});

// Article from
router.get('/new', (req, res) => {
  res.render('articleForm');
});

// Capturing the data
router.post('/', (req, res, next) => {
  var data = req.body;
  console.log(data);
  Article.create(data, (err, newArticle) => {
    if (err) return next(err);
    res.redirect('/article');
  });
});

// single article
router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render('articleDetails', { article });
  });
});

//edit an article
router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id;
  Article.findById(id, (err, article) => {
    article.tags = article.tags.join(' ');
    if (err) return next(err);
    res.render('editArticleForm', { article });
  });
});

// Update article
router.post('/:id', (req, res) => {
  var id = req.params.id;
  req.body.tags = req.body.tags.split(' ');
  Article.findByIdAndUpdate(id, req.body, (err, updatedData) => {
    if (err) return next(err);
    res.redirect('/article/' + id);
  });
});

// delete article
router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndDelete(id, (err, article) => {
    if (err) return next(err);
    res.redirect('/article');
  });
});

//increment likes
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect('/article/' + id);
  });
});

// for decrement or dislike
router.get('/:id/dislike', (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect('/article/' + id);
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  return res.redirect('/users/login');
});

module.exports = router;
