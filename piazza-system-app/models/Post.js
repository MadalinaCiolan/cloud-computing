const { number } = require('joi')
const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    post_title:{
        type: String,
        required: true
    },
    topic_id:{
        type: String,
        required: true
    },
    post_time_stamp:{
        type: Date,
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
    post_status:{
        type: String,
        required: true
    },
    post_owner_id:{
        type: String,
        required: true        
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('posts',PostSchema)