const express = require('express')
const router = express.Router()

const Interaction = require('../models/Interaction')
const Action = require('../models/Action')

// POST (Create data)
router.post('/', async (req, res) => {
    console.log("Request body: " + req.body)
    //try to insert
    try {
        // Get the Dislike action id
        const dislikeAction = await Action.findOne({ action_name: "Dislike" })
        // We hardcode the action id for now
        const interactionData = new Interaction({
            post_id: req.body.post_id,
            action_id: dislikeAction._id,
            user_id: req.body.user_id
        })
        // We do this operation synchronously
        const savedInteraction = await interactionData.save()

        // save the interaction
        res.send("Response after dislike: " + savedInteraction)
    } catch (err) {
        res.status(400).send({ message: err })
    }

})

module.exports = router