const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validations/validation')

router.post('/register', async (req, res) => {
    // Validation of user input
    const { error } = registerValidation(req.body)
    if (error) {
        res.status(400).send({ message: error['details'][0]['message'] })
        return
    }

    // Validate if user already exists
    const userExists = await User.findOne({ email: req.body.user_email })
    if (userExists) {
        res.status(400).send({ message: "User already exists" })
        return
    }

    // Now hash the password so we don't store it in plain text
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.user_password, salt)

    // If validation has passed create the user
    const user = new User({
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: hashedPassword
    })

    try {
        const savedUser = await user.save()
        res.send(savedUser)
    }
    catch (err) {
        res.status(500).send({ message: err })
    }

})

router.post('/login', async (req, res) => {
    // Validation of user input
    const { error } = loginValidation(req.body)
    if (error) {
        res.status(400).send({ message: error['details'][0]['message'] })
        return
    }

    // Validate if user already exists
    const existingUser = await User.findOne({ user_email: req.body.user_email })
    if (!existingUser) {
        res.status(400).send({ message: "User does not exist. Please register" })
        return
    }

    // Validate the password
    const passwordValid = await bcryptjs.compare(req.body.user_password, existingUser.user_password)
    if (!passwordValid) {
        res.status(400).send({ message: "Incorrect password" })
        return
    }

    // Generate the authentication token since login was successful
    const token = jsonwebtoken.sign({ _id: existingUser._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({ 'auth-token': token })
})

module.exports = router