const mongoose = require("mongoose");

const ActionSchema = mongoose.Schema({
    action_name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("actions", ActionSchema);
