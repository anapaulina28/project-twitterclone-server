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

// router.get('/tweets', isAuthenticated, async (req, res) =>{
    
//     try {

//         let allTweets = await Tweet.find().populate('author comments likes')
//         // .populate('author', 'name')
//         // .populate('comments')
//         // .populate('likes')
//         res.json(allTweets)
//     } catch (error) {
//         res.json(error)
//     }
// })

router.get('/tweets', isAuthenticated, async (req, res) => {
    try {
        const allTweets = await Tweet.find()
            .populate('author', 'name')
            .populate('comments')
            .populate('likes')
            .exec();

        res.json(allTweets);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/tweets/:tweetId',  isAuthenticated, async (req, res) =>{
    const {tweetId} = req.params;

    try {
        let foundTweet = await Tweet.findById(tweetId).populate('comments likes author')

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

router.post('/tweets/:tweetId/likes', isAuthenticated, async (req, res) => {
    const {tweetId} = req.params
    const user = req.payload._id
    try {
        await User.findByIdAndUpdate(user, {$push: {likes: tweetId}})
        await Tweet.findByIdAndUpdate(tweetId, {$push: {likes: user}})

        res.json({Message: 'Tweet Liked'})
    } catch (error) {
        res.json(error)
    }
})



router.post('/comment/create/:tweetId', isAuthenticated, async (req, res) =>{
    const {tweetId} = req.params
    const { text } = req.body
    const user = req.payload._id
    try {
       const comment = await Comment.create({text, author : user});
       await Tweet.findByIdAndUpdate(tweetId, {$push: {comments: comment._id }}) 
       await User.findByIdAndUpdate(user, {$push: {comments: comment._id}})

        res.json(comment)
    } catch (error) {
        res.json(error)
    }
})

router.delete('/comment/delete/:commentId/:tweetId', isAuthenticated, async (req, res) =>{
     const {commentId, tweetId} = req.params
     const user = req.payload._id
    try {
        await Tweet.findByIdAndUpdate(tweetId, {$pull: {comments: commentId}})
        await User.findByIdAndUpdate(user, {$pull: {comments: commentId}})
        await Comment.findByIdAndRemove(commentId)

    res.json({message: 'Comment Deleted'})
    } catch (error) {
        res.json(error)
    }
     
})


router.get('/search/user', isAuthenticated, async (req, res) => {
    const searchQuery = req.query.name
    try {
        const foundUsers = await User.find({ name: { $regex: new RegExp(searchQuery, 'i') } });
        if(foundUsers.length === 0){
            res.json({errorMessage: "Can't Find User. Try Again"})
        } else {
            res.json(foundUsers)
        }
    } catch (error) {
        res.json(error)
    }
})

router.get("/likes", isAuthenticated, async (req, res) => {
    const user = req.payload._id
    try {
       const userLikes = await User.findById(user).populate('likes')
       res.json(userLikes)
       console.log(userLikes)
    } catch (error) {
        res.json(error)
    }
})









module.exports = router