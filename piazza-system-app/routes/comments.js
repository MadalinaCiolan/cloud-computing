const express = require('express')
const router = express.Router()

const Comment = require('../models/Comment')
const Interaction = require('../models/Interaction')
const Action = require('../models/Action')
const Post = require('../models/Post')
const validate_token = require('../validations/validate_token')

// POST (Create comment)
router.post('/', validate_token, async (req, res) => {
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
        // Find the post to get the post owner
        const post = await Post.findOne({ _id: req.body.post_id })
        // Validate that the post is not expired
        if (Date.now() >= Post.get_post_expiration_date(post)) {
            res.status(400).send({ message: 'Post has expired. No more comments are allowed' })
            return
        }
        // If the post is not expired, then continue storing the interaction. Note that a user can comment on their own posts
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
router.get('/', validate_token, async (req, res) => {
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