var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    author: String,
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
