const mongoose = require('mongoose')

const InteractionSchema = mongoose.Schema({
    post_id:{
        type: String,
        required: true
    },
    action_id:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    },
    comment_id:{
        type: String,
        required: false
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('interactions',InteractionSchema)