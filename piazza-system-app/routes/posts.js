const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const Comment = require('../models/Comment')
const Interaction = require('../models/Interaction')
const Topic = require('../models/Topic')
const User = require('../models/User')
const Action = require('../models/Action')
const validate_token = require('../validations/validate_token')

// POST (Create data)
router.post('/', validate_token, async (req, res) => {

    // We construct the post that will be stored
    const postData = new Post({
        post_title: req.body.post_title,
        topic_id: req.body.topic_id,
        post_text: req.body.post_text,
        post_expiration_time: req.body.post_expiration_time,
        post_owner_id: req.body.post_owner_id
    })

    //Try to insert it in the database
    try {
        const postToSave = await postData.save()
        res.send(postToSave)
    } catch (err) {
        res.status(400).send({ message: err })
    }

})

//GET (Read by ID)
router.get('/', validate_token, async (req, res) => {
    try {
        // Check if the request body is empty or if we need to do some filtering
        let postQuery = Post.find()
        if (Object.keys(req.body).length !== 0) {
            // We assume we will get the topic id that we need to filter on
            postQuery = postQuery.where("topic_id").equals(req.body.topic_id)
        }

        // Execute the query
        const postList = await postQuery

        // Start bulding the reply object
        let postResponseArray = []

        // Get the general interaction information that we will be looking for in the posts
        const likeAction = await Action.findOne({ action_name: "Like" })
        const dislikeAction = await Action.findOne({ action_name: "Dislike" })
        const commentAction = await Action.findOne({ action_name: "Comment" })

        for await (const post of postList) {
            // Get interaction information
            const postInteractions = await Interaction.find({ post_id: post._id })
            let numberOfLikes = 0
            let numberOfDislikes = 0
            let commentList = []
            for (const interaction of postInteractions) {
                if (interaction.action_id == likeAction._id) {
                    numberOfLikes++
                }
                else if (interaction.action_id == dislikeAction._id) {
                    numberOfDislikes++
                }
                else if (interaction.action_id == commentAction._id) {
                    // We assume there is no other interaction type so
                    const comment = await Comment.findOne({ _id: interaction.comment_id })
                    const commentUser = await User.findOne({ _id: interaction.user_id })
                    commentList.push({
                        user_id: interaction.user_id,
                        user_name: commentUser.user_name,
                        comment_text: comment.comment_text,
                        comment_date: interaction.interaction_creation_ts
                    })
                }
            }

            // Get Topic information ( we assume a single topic per post for now)
            const topic = await Topic.findOne({ _id: post.topic_id })

            // Calculate post expiration status. We chose minutes as the unit of time for expiration
            const postStatus = Date.now() >= Post.get_post_expiration_date(post) ? "Expired" : "Live"

            // Get the post owner name (we assume a single owner per post)
            const postOwner = await User.findOne({ _id: post.post_owner_id })

            // Check if we need to filter expired posts or not
            let includePostInResults = false
            if (Object.keys(req.body).length === 0 || req.body.include_expired_posts === "yes") {
                includePostInResults = true
            }
            else {
                // Only include the result if the post is still live
                if (postStatus == "Live") {
                    includePostInResults = true
                }
            }
            // Push the post in the result array if it complies with the conditions
            if (includePostInResults) {
                postResponseArray.push({
                    post_id: post._id,
                    post_title: post.post_title,
                    post_topic: topic.topic_category,
                    post_time_stamp: post.post_creation_ts,
                    post_message_body: post.post_text,
                    post_expiration_time: post.post_expiration_time,
                    post_status: postStatus,
                    post_owner_name: postOwner.user_name,
                    post_likes: numberOfLikes,
                    post_dislikes: numberOfDislikes,
                    post_comments: commentList
                })
            }

        }

        // Check if we need to return only the most active post i.e.  the one with most likes and dislikes altogether
        if (Object.keys(req.body).length !== 0 && req.body.most_active_post === "yes") {
            postResponseArray = postResponseArray.reduce((max, obj) => {
                const combinedValue = obj.post_likes + obj.post_dislikes
                return combinedValue > (max.post_likes + max.post_dislikes) ? obj : max
            })
        }

        res.send(postResponseArray)
    } catch (err) {
        res.status(500).send({ message: err })
    }
})

// PATCH (Update)
router.patch('/:postId', validate_token, async (req, res) => {
    try {
        const updatePostById = await Post.updateOne(
            { _id: req.params.postId },
            {
                $set: {
                    post_title: req.body.post_title,
                    topic_id: req.body.topic_id,
                    post_time_stamp: req.body.post_time_stamp,
                    post_text: req.body.post_text,
                    post_expiration_time: req.body.post_expiration_time,
                    post_status: req.body.post_status,
                    post_owner_id: req.body.post_owner_id
                }
            })
        res.send(updatePostById)
    } catch (err) {
        res.status(500).send({ message: err })
    }

})

module.exports = router