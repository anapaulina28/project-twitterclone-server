const express = require("express");
const router = express.Router();

const {isAuthenticated} =require("../middleware/jwt.middleware.js");


const User = require('../models/User.model')
const Tweet = require('../models/Tweet.model')
const Comment = require('../models/Comment.model')


router.post('/tweets', isAuthenticated, async (req, res) => {
    const {text} = req.body
    const user = req.payload._id
    try {
        let tweet = await Tweet.create({text , author: user})
        await User.findByIdAndUpdate(user, { $push: {tweets: tweet._id}})
        console.log(user)
        res.json(tweet)
    } catch (error) {
        res.json(error)
    }
})

router.get('/tweets', isAuthenticated, async (req, res) =>{
    try {

        let allTweets = await Tweet.find()
        // .populate('author', 'name')
        // .populate('comments')
        // .populate('likes')
        res.json(allTweets)
    } catch (error) {
        res.json(error)
    }
})



router.get('/tweets/:tweetId',  isAuthenticated, async (req, res) =>{
    const {tweetId} = req.params;

    try {
        let foundTweet = await Tweet.findById(tweetId).populate('comments')

        console.log('Found Tweet:', foundTweet)
        res.json(foundTweet)
    } catch (error) {
        res.json(error)
    }
})

router.put('/tweets/:tweetId/edit', isAuthenticated, async (req, res) =>{
    const {text} = req.body
    const {tweetId} = req.params
    try {
        let updateTweet = await Tweet.findByIdAndUpdate(tweetId, {text}, {new: true})
        res.json(updateTweet)
    } catch (error) {
        res.json(error)
    }
})

router.delete('/tweets/:tweetId/delete', isAuthenticated, async (req, res) => {
    const {tweetId} = req.params
    const user = req.payload._id
    try {
        await Tweet.findByIdAndRemove(tweetId);
        await User.findByIdAndUpdate(user, {$pull: {tweets: tweetId}})

        res.json({message: 'Tweet Deleted'})
    } catch (error) {
        res.json(error)
    }
})






module.exports = router