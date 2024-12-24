const mongoose = require("mongoose");

// We use the mongoose feature to automatically add creation and update timestamps to documents
const PostSchema = mongoose.Schema(
    {
        post_title: {
            type: String,
            required: true,
        },
        topic_id: {
            type: String,
            required: true,
        },
        post_text: {
            type: String,
            required: true,
        },
        post_expiration_time: {
            type: Number,
            required: true,
        },
        post_owner_id: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: { createdAt: "post_creation_ts", updatedAt: "post_update_ts" },
    }
);

function get_post_expiration_date(post) {
    const expirationDate = new Date(post.post_creation_ts);
    expirationDate.setMinutes(
        post.post_creation_ts.getMinutes() + post.post_expiration_time
    );
    return expirationDate;
}

module.exports = mongoose.model("posts", PostSchema);
module.exports.get_post_expiration_date = get_post_expiration_date;
