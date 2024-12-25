const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
    comment_text: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('comment', CommentSchema)