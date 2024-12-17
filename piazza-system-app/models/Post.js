const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    post_title:{
        type: String
    },
    topic_id:{
        type: String
    },
    post_time_stamp:{
        type: String
    },
    post_text:{
        type: String
    },
    post_expiration_time:{
        type: String
    },
    post_status:{
        type: String
    },
    post_owner_id:{
        type: String
    }
})

module.exports = mongoose.model('posts',PostSchema)