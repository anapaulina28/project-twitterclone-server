const {Schema, model} = require('mongoose')

const commentSchema = new Schema({
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tweet: { type: Schema.Types.ObjectId, ref: 'Tweet'},
    createdAt: { type: Date, default: Date.now },
  });
  
  const Comment = model('Comment', commentSchema);
  
  module.exports = Comment;
  