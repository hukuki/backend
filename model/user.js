require('./db.js');

// Path: backend/model/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    email:{
        type: String,
        required: true,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;