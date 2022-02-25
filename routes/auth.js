const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/User')

// Register
router.post('/register', async (req, res) => {
    try {
        // Generate new passwork
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // Create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        // Save, response
        const user = await newUser.save()
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (!user) {
            res.status(404).json("User not found...")
            return
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            res.status(400).json("Wrong password...")
            return
        }

        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router