const express = require('express')
const router = express.Router()

const Comment = require('../models/Comment')
const Interaction = require('../models/Interaction')
const Action = require('../models/Action')

// POST (Create data)
router.post('/', async (req, res) => {
    console.log("Request body: " + req.body)
    //try to insert
    try {
        const commentData = new Comment({
            comment_text: req.body.comment_text
        })
        // We save the comment first
        const savedComment = await commentData.save()
        // Then we create a new interaction for this particular comment that was saved
        const commentAction = await Action.findOne({ action_name: "Comment" })
        const interactionData = new Interaction({
            post_id: req.body.post_id,
            action_id: commentAction._id,
            user_id: req.body.user_id,
            comment_id: savedComment._id
        })

        // save the interaction
        const savedInteraction = await interactionData.save()
        res.send("Response after comment saved: " + savedInteraction)
    } catch (err) {
        res.status(400).send({ message: err })
    }

})

//GET 1 (Read All comments for a given post_id)
router.get('/', async (req, res) => {
    try {
        let commentsArray = []
        // Get the Comment action id
        const commentAction = await Action.findOne({ action_name: "Comment" })
        // We find all the interactions that are of type fomment for a particular post
        const interactionsList = await Interaction.find({ post_id: req.body.post_id, action_id: commentAction._id })
        for (const interaction of interactionsList) {
            const comment = await Comment.findOne({ _id: interaction.comment_id })
            commentsArray.push({
                post_id: interaction.post_id,
                user_id: interaction.user_id,
                comment_id: interaction.comment_id,
                comment_text: comment.comment_text,
                comment_creation_date: interaction.interaction_creation_ts
            })
        }
        res.send(commentsArray)
    } catch (err) {
        res.status(500).send({ message: err })
    }
})

module.exports = router