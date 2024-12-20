const express = require('express')
const router = express.Router()

const Comment = require('../models/Comment')
const Interaction = require('../models/Interaction')

// POST (Create data)
router.post('/', async (req,res)=>{
   console.log("Request body: "+req.body)
   //try to insert
    try{
        const commentData = new Comment ({
            comment_text: req.body.comment_text
       })
       // We do this operation synchronously
       const savedComment = await commentData.save()
       // We need to get the action id programatically instead of hardcoding it
       const comment_action_id = "6761639c185c5bf47933f237"
       const interactionData = new Interaction({
            post_id: req.body.post_id,
            action_id: comment_action_id,
            user_id: req.body.user_id,
            comment_id: savedComment._id
       })

       // save the interaction
       const savedInteraction = await interactionData.save()
       res.send("Response after comment saved: "+savedInteraction)
    }catch(err){
        res.status(400).send({message:err})
    }

})

//GET 1 (Read All comments for a given post_id)
router.get('/', async(req,res)=>{
    try{
        let commentsArray = []
        const getInteractions = Interaction.find({post_id: req.body.post_id})
        for await (const interaction of getInteractions){
            console.log("Current interaction: "+interaction)
            const comment = Comment.find({_id: interaction.comment_id})
            console.log("Associated comment: "+comment)
            commentsArray.push({
                post_id: interaction.post_id,
                user_id: interaction.user_id,
                comment_id: interaction.comment_id,
                comment_text: comment.comment_text,
                comment_date: interaction.date
            })
        }
        res.send(commentsArray)
    }catch(err){
        res.send({message:err})
    }
})





module.exports = router