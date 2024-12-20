const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const Comment = require('../models/Comment')
const Interaction = require('../models/Interaction')
const Topic = require('../models/Topic')

// POST (Create data)
router.post('/', async (req,res)=>{
   //console.log(req.body)

   const postData = new Post ({
        post_title:req.body.post_title,
        topic_id:req.body.topic_id,
        post_time_stamp:req.body.post_time_stamp,
        post_text:req.body.post_text,
        post_expiration_time:req.body.post_expiration_time,
        post_status: req.body.post_status,
        post_owner_id:req.body.post_owner_id

   })
    
   //try to insert
    try{
        const postToSave = await postData.save()
        res.send(postToSave)
    }catch(err){
        res.status(400).send({message:err})
    }

})



//GET 2 (Read by ID)
router.get('/', async(req,res)=>{
    try{
        // Get the post information
        const postList = await Post.find(req.body)
        let postResponseArray = []

        for await (const post of postList){
            // GEt interaction information
            const postInteractions = Interaction.find({post_id: post._id})
            let numberOfLikes = 0
            let numberOfDislikes = 0
            let commentList = []
            for await (const interaction of postInteractions){
                if(interaction.action_id == "676153b4185c5bf47933f22c"){
                    numberOfLikes++
                }
                else if(interaction.action_id == "676153eb185c5bf47933f22d"){
                    numberOfDislikes++
                }
                else{
                    // We assume there is no other interaction type so
                    const comment = Comment.find({_id: interaction.comment_id})
                    console.log("Associated comment: "+comment)
                    commentList.push({
                        user_id: interaction.user_id,
                        comment_text: comment.comment_text,
                        comment_date: interaction.date
                    })
                }
            }

            // Get Topic information
            const topic = await Topic.find({_id: post.topic_id})

            // Calculate post expiration status. We chose minutes as the unit of time for expiration
            const expirationDate = new Date(post.post_time_stamp)
            expirationDate.setMinutes(post.post_time_stamp.getMinutes()+post.post_expiration_time)
            const postStatus = Date.now() >= expirationDate ? "Expired" : "Live"

            // Get the post owner name
            const postOwner = await User.find({_id: post.user_id})

            postResponseArray.push({
                post_id: post._id,
                post_title: post.post_title,
                post_topic: topic.topic_category,
                post_time_stamp: post.post_time_stamp,
                post_message_body: post.post_text,
                post_expiration_time: post.post_expiration_time,
                post_status: postStatus,
                post_owner_name: postOwner.name,
                post_likes: numberOfLikes,
                post_dislikes: numberOfDislikes,
                post_comments: commentList
            })
        }
        res.send(postResponseArray)
    }catch(err){
        res.send({message:err})
    }
})

// PATCH (Update)
router.patch('/:postId', async(req,res)=>{    
    try{
        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                post_title:req.body.post_title,
                topic_id:req.body.topic_id,
                post_time_stamp:req.body.post_time_stamp,
                post_text:req.body.post_text,
                post_expiration_time:req.body.post_expiration_time,
                post_status: req.body.post_status,
                post_owner_id:req.body.post_owner_id
                }
            })
        res.send(updatePostById)
    }catch(err){
        res.send({message:err})
    }

})



module.exports = router