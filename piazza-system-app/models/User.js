const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    user_name:{
        type: String,
        required: true,
        min: 3,
        max:256
    },
    user_email:{
        type: String,
        required: true,
        min: 6,
        max:256
    },
    user_password:{
        type: String,
        required: true,
        min: 6,
        max:1024
    }
},
{timestamps: {createdAt: "user_creation_ts", updatedAt: "user_update_ts"}
})

module.exports = mongoose.model('user',UserSchema)