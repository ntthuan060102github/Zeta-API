const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

// Create a post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try { 
        const savePost = await newPost.save()
        res.status(200).json(savePost)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Update a post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body})
            res.status(200).json("The post has been updated!")
        }
        else {
            res.status(404).json("You can update only your posts...")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json("The post has been deleted!")
        }
        else {
            res.status(404).json("You can delete only your posts...")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Like - dislike a post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId }})
            res.status(200).json("The post has been liked!")
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId }})
            res.status(200).json("User has removed like on this post!")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Get timeline posts
router.get("/timeline/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const userPosts = await Post.find({userId: user._id})
        const friendPosts = await Promise.all(
            user.followings.map(friendId => {
                return Post.find({userId: friendId})
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Get user's all posts
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})
        const posts = await Post.find({userId: user._id})
        res.status(200).json(posts)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router