const { application } = require('express');
const mongoose = require('mongoose');
const slugify = require('slug-generator');

let articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  likes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slug: { type: String, slug: 'title' },
});

// Adding a slug everytime  a user adds a article in our blog application
articleSchema.pre('save', async function (next) {
  this.slug = await slugify(this.title, '_');
  this.slug = (await this.slug) + random();
  console.log('converted with the help of a package' + this);
  return next();
});
function random(limit = 1000) {
  return Math.floor(Math.random() * limit);
}

let Article = mongoose.model('Article', articleSchema);
module.exports = Article;
