const { number } = require('joi')
const mongoose = require('mongoose')

// We use the mongoose feature to automatically add creation and update timestamps to documents
const PostSchema = mongoose.Schema({
    post_title:{
        type: String,
        required: true
    },
    topic_id:{
        type: String,
        required: true
    },
    post_text:{
        type: String,
        required: true
    },
    post_expiration_time:{
        type: Number,
        required: true
    },
    post_owner_id:{
        type: String,
        required: true        
    }
},
{timestamps: {createdAt: "post_creation_ts", updatedAt: "post_update_ts"}
})

module.exports = mongoose.model('posts',PostSchema)