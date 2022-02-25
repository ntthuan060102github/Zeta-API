const router = require('express').Router()
const Conversation = require('../models/Conversation')

// New conversation
router.post("/", async (req, res) => {
    const newConv = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })

    try {
        const saveConv = await newConv.save()
        res.status(200).json(newConv)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Get conversation
router.get("/:userId", async (req, res) => {
    try {
        const conv = await Conversation.find({
            members: {$in: [req.params.userId]}
        })
        res.status(200).json(conv)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Get conv includes 2 users
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
        const conv = await Conversation.findOne({
            members: {$all: [req.params.firstUserId, req.params.secondUserId]}
        })

        res.status(200).json(conv)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router