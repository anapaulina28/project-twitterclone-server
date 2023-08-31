const {Schema, model} = require('mongoose');

const tweetSchema = new Schema({
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User',  /*required: true */ },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  });
  
const Tweet = model('Tweet', tweetSchema);
  
module.exports = Tweet;
  