const mongoose = require('mongoose');
let commentSchema = new mongoose.Schema(
  {
    author: { type: String },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

let Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
