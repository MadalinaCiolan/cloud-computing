const express = require('express')
const router = express.Router()

const Interaction = require('../models/Interaction')
const Action = require('../models/Action')
const Post = require('../models/Post')
const validate_token = require('../validations/validate_token')

// POST (Create data)
router.post('/', validate_token, async (req, res) => {
    console.log("Request body: " + req.body)
    //try to insert
    try {
        // Get the Like action id
        const likeAction = await Action.findOne({ action_name: "Like" })
        // Find the post to get the post owner
        const post = await Post.findOne({ _id: req.body.post_id })
        // Validate that the post is not expired
        if (Date.now() >= Post.get_post_expiration_date(post)) {
            res.status(400).send({ message: 'Post has expired. No more likes are allowed' })
            return
        }
        // Validate that the user wanting to like the post is not the owner
        if (post.post_owner_id == req.body.user_id) {
            res.status(400).send({ message: 'A user cannot like their own posts' })
            return
        }
        // If it is not the post owner, then continue storing the interaction
        const interactionData = new Interaction({
            post_id: req.body.post_id,
            action_id: likeAction._id,
            user_id: req.body.user_id
        })
        // We do this operation synchronously
        const savedInteraction = await interactionData.save()

        // save the interaction
        res.send("Response after like: " + savedInteraction)
    } catch (err) {
        res.status(400).send({ message: err })
    }

})

module.exports = router