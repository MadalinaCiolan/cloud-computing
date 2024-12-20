const mongoose = require('mongoose')

const TopicSchema = mongoose.Schema({
    topic_category:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('topic',TopicSchema)