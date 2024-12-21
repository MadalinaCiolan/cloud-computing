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
    }
}, {
    timestamps: {createdAt: "interaction_creation_ts", updatedAt: "interaction_update_ts"}
}
)

module.exports = mongoose.model('interactions',InteractionSchema)