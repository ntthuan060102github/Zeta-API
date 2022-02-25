const router = require('express').Router()
const Message = require('../models/Message')

// Add
router.post("/", async (req, res) => {
    const newMess = new Message(req.body)

    try {
        const saveMess = await newMess.save()

        res.status(200).json(saveMess)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Get
router.get("/:conversationId", async (req, res) => {
    try {
        const mess = await Message.find({
            conversationId: req.params.conversationId,
        })
        res.status(200).json(mess)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router