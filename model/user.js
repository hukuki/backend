require('./db.js');

// Path: backend/model/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
    auth_provider_id: {
        type: String,
        required: true,
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;