const express = require('express')
const router = express.Router()

const Post = require('../models/Post')

router.get('/', async (req,res)=>{
    
    try{
        const posts = await Post.find()
        console.log("Data from MongoDB: "+posts)
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }

})

module.exports = router